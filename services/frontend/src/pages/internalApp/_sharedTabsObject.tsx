import {GenericPageTabsType} from '../../types/typesGenericPage';

export const sharedTabsObject = (objectId: number): GenericPageTabsType => ({
  type: 'tabs',
  data: [
    {
      label: 'Components',
      link: `/objects/${objectId}`,
      path: '/objects/:objectId',
      // icon: <SettingsInputComponentIcon />,
    },
    {
      label: 'Timers',
      link: `/objects/${objectId}/timers`,
      path: '/objects/:objectId/timers',
      // icon: <AiFillThunderbolt />,
    },
    {
      label: 'Alerts',
      link: `/objects/${objectId}/alerts`,
      path: '/objects/:objectId/alerts',
      // icon: <NotificationsIcon />,
    },
    {
      label: 'Actions',
      link: `/objects/${objectId}/actions`,
      path: '/objects/:objectId/actions',
      // icon: <AiFillThunderbolt />,
    },
  ],
});
