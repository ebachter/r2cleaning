import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {popupAppWidgetDelete} from '../../popups/popupWidgets';
import {callAppWidgetsLoad} from '../../utils/trpcCalls';
import {useEffect} from 'react';
import useTypedParams from '../../hooks/useTypedParams';
import GenericPage from '../../GenericPage';

const WidgetPage = () => {
  useEffect(() => {
    callAppWidgetsLoad();
  }, []);

  const {widgetId} = useTypedParams(['widgetId']);

  const bookmark = useSelector((state: RootState) => state.widgets[widgetId]);
  const widgetInfo = bookmark || {};
  const {name, descr, creatorId} = widgetInfo || {};
  const widgetProject = bookmark.project;

  return (
    <GenericPage
      pageData={{
        settingsMenu: [
          {
            label: 'Delete',
            // icon: Fullscreen,
            onClick: () => {
              popupAppWidgetDelete({
                widgetId: Number(widgetId),
                widgetName: name,
              });
            },
          },
        ],

        subHeader: ['filter'],
        content: [
          {
            type: 'subtitle',
            primary: 'Widget name',
          },
          {
            type: 'container',
            list: [{primaryText: name}],
          },
          {
            type: 'subtitle',
            primary: 'Widget description',
          },
          {
            type: 'container',
            list: [{primaryText: descr}],
          },
          {
            type: 'subtitle',
            primary: 'Project',
          },
          {
            type: 'list',
            // title: 'Project',
            data: [
              {
                id: Number(widgetProject?.projectId),
                link: `/projects/${widgetProject?.projectId}`,
                primaryText: widgetProject?.projectName || '',
                // secondaryText: `by ${o.username}`,
                primaryTextProjectColor: widgetProject?.projectColor,
              },
            ],
          },
          {
            type: 'subtitle',
            primary: 'Linked models',
          },
          {
            type: 'container',
            list: widgetInfo?.objectsOfModels.map((tmp) => {
              const {modelid, name, icon} = tmp;
              return {
                primaryText: name,
                customIcon: icon,
                link: `/search/models/${modelid}`,
              };
            }),
          },
          /* {
              type: 'subtitle',
              value: 'Provisions',
            },
            {
              type: 'container',
              list: widgetInfo?.privateObjects.map(
                ({modelid, name, icon, registered}, i) => {
                  return {primaryText: name};
                },
              ),
            }, */
          {
            type: 'subtitle',
            primary: `Creator of widget`,
          },
          {
            type: 'container',
            list: [
              {
                primaryText: `@${creatorId}`,
                link: `/search/users/${creatorId}`,
              },
            ],
          },
        ],
      }}
    />
  );
};

export default WidgetPage;
