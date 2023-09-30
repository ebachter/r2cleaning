import {t} from '../i18n/i18n';
import {replaceRoute} from '../router/helpers';
import {trpcFunc} from '../trpc';
import {Color} from '../types/typesColor';
import {Popup} from '../types/typesPopup';
import {callProjectsLoad} from '../utils/trpcCalls';
import {closePopup, setPopup} from '../zustand/popup';

export const popupProjectsCreateInit = (args?: {
  name: string;
  descr: string;
  color: Color;
}): Popup => {
  const {name} = args || {}; // , descr, color
  return {
    header: t('topic.create.header'),
    content: [
      {
        type: 'info',
        elemKey: 'info1',
        // id: 'topic.create.info',
        bodyText: t('topic.create.info'),
      },
      {
        type: 'input',
        // id: 'topic.create.name',
        elemKey: 'name',
        defaultValue: name || '',
        labelText: t('topic.create.name'),
      },
      {
        type: 'input',
        // id: 'topic.create.descr',
        elemKey: 'descr',
        defaultValue: name || '',
        multiline: {rows: 2},
        labelText: t('topic.create.descr'),
      },
      // { type: 'input', id: 'topic.create.color', key: 'color', value: color },
      {
        type: 'color',
        // id: 'topic.create.color',
        elemKey: 'color',
        value: '#ffffff',
      },
    ],
    buttons: [
      {type: 'cancel', elemKey: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'create',
        labelText: t('button.create'),
        onClick: async ({name, descr, color}) => {
          await trpcFunc.trpcAppProjectAdd.mutate({name, descr, color});
          callProjectsLoad();
          closePopup();
        },
      },
    ],
  };
};

export const popupProjectDeleteInit = ({projectId}: {projectId: number}) =>
  setPopup({
    open: true,
    mandatory: false,
    loading: false,
    header: t('topic.delete.header'),
    content: [
      {type: 'info', elemKey: 'info1', bodyText: t('topic.delete.info')},
    ],
    buttons: [
      {type: 'cancel', elemKey: 'cancel'},
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        elemKey: 'confirm',
        labelText: t('button.delete'),
        onClick: async () => {
          await trpcFunc.trpcAppProjectDel.mutate({
            projectId: Number(projectId),
          });
          callProjectsLoad();
          replaceRoute('/projects');
          closePopup();
        },
      },
    ],
  });

export const popupProjectsCreateSuccess = (): Popup => ({
  open: true,
  mandatory: true,
  header: t('topic.create.header'),
  loading: false,
  content: [
    {
      type: 'success',
      elemKey: 'success',
      bodyText: t('topic.create.success'),
    },
  ],
  buttons: [{type: 'close', elemKey: 'closeButton'}],
});
