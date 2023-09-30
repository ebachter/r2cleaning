import {prisma} from '@remrob/mysql';
import {router, protectedProcedure, publicProcedure} from '../middleware';

export const anaProvisionsRouter = router({
  anaLoadProvisions: protectedProcedure.query(async ({ctx}) => {
    const provisions = (await prisma.$queryRaw`
    SELECT 
      p.provision_id, 
      p.master_object_fk, 
      o.object_name master_object_name, 
      os.model_fk, 
      ms.json_model_full->>'$.name' slave_model_name, 
      p.label, 
      p.slave_mqtt_client_id
    FROM r2db.objects_provisions p
    INNER JOIN r2db.objects o ON o.object_id = p.master_object_fk
    # INNER JOIN r2db.models m ON m.model_id = p.slave_model_fk
    INNER JOIN r2db.objects os ON os.mqtt_client_id = p.slave_mqtt_client_id
    INNER JOIN r2db.models ms ON ms.model_id = os.model_fk
    WHERE p.user_fk = ${ctx.session?.userid};
  `) as {
      provision_id: number;
      master_object_fk: number;
      master_object_name: string;
      slave_model_name: string;
      label: string;
      slave_mqtt_client_id: string;
    }[];

    return provisions;
  }),
});
