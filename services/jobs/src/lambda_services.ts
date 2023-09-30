import {prisma, Prisma} from '@remrob/mysql';
import {VM, VMScript, NodeVM} from 'vm2';
import {fetch} from 'undici';
// declare var fetch: typeof import('undici').fetch;

// const isolate = new ivm.Isolate({memoryLimit: 8 /* MB */});
// const script = isolate.compileScriptSync(code);
// const context = isolate.createContextSync();

const getSandbox = ({
  serviceTemplateId,
}: // models,
{
  serviceTemplateId: number;
  // models: {modelId: number; mapping: Record<string, string | number>}[];
}) => ({
  console: {
    log: (...args: any) => {
      console.log(args);
    },
  },
  setTimers: async (date: Date) => {
    console.log('date->', date);

    const services = (await prisma.$queryRaw`
      select s.object_fk, o.model_fk, stm.mapping
      from r2db.services s
      inner join r2db.objects o on o.object_id=s.object_fk
      inner join r2db.services_templates_models stm
      on stm.model_fk=o.model_fk and stm.service_template_fk = s.service_template_fk
      where s.service_template_fk=${serviceTemplateId} ;
    `) as {object_fk: number; mapping: any}[];

    for (const service of services) {
      console.log('--service--');
      console.log(JSON.stringify(service));

      try {
        const res = await prisma.objects_timers.create({
          data: {
            user_fk: 93,
            object_fk: service.object_fk,
            switch_id: String(service.mapping.switchId),
            task_id: String(service.mapping.taskId),
            time_zone: 'UTC', // 'Europe/Berlin',
            gmt_diff: 0, // 3600,
            orig_date_from: new Date(date),
            orig_date_to: new Date(date),
            orig_time: new Date(date),
            orig_mon: true,
            orig_tue: true,
            orig_wed: true,
            orig_thu: true,
            orig_fri: true,
            orig_sat: true,
            orig_sun: true,
            utc_date_from: new Date(date).toLocaleString('en-UK', {
              timeZone: 'UTC',
            }),
            utc_date_to: new Date(date).toLocaleString('en-UK', {
              timeZone: 'UTC',
            }),
          },
        });
        console.log('res', res);
      } catch (e) {
        console.log(e);
      }
    }
  },
  fetch: fetch,
});

export const handler = async () => {
  const functions = await prisma.services_templates.findMany({
    select: {
      service_template_id: true,
      function_code_schedule: true,
    },
    where: {NOT: [{function_code_schedule: null}]},
  });

  for (const fn of functions) {
    if (fn?.function_code_schedule) {
      const vm = new VM({
        allowAsync: true,
        sandbox: getSandbox({
          serviceTemplateId: fn.service_template_id,
        }),
      });
      const vmv = await vm.run(fn.function_code_schedule);
      await vmv();
      // console.log('>>>', await vmv());
    }
  }

  /* const vm = new VM({sandbox});
  vm.run(`
    const array = [ 'foo', 'bar', 'blah' ]; 
    const ret = get_input(array[1]);
    display(ret);
  `); */
};
