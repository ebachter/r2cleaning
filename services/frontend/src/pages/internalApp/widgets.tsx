import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {useLocation} from 'react-router-dom';
import {callAppWidgetsLoad} from '../../utils/trpcCalls';
import GenericPage from '../../GenericPage';

const WidgetsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    callAppWidgetsLoad();
  }, [dispatch]);

  // const queryParams = new URLSearchParams(location.search);
  let bookmarks = useSelector((state: RootState) => state.widgets);

  /* if (objectidParam) {
    const {modelId: sModelid, mqttClientId: sMqttClientId} =
      objects[objectidParam];
    bookmarks = Object.entries(bookmarks).reduce((o, [k, a]) => {
      if (
        a.objectsOfModels.some((o) => o.modelid === sModelid) ||
        a.privateObjects
          .map(({modelid, mqttClientId}) => `${modelid}-${mqttClientId}`)
          .includes(`${sModelid}-${sMqttClientId}`)
        // || a.publicObjects.includes(String(objectidParam))
      )
        return {[k]: {...a}, ...o};
      else return o;
    }, {});
  } */

  const widgetArray = Object.entries(bookmarks).map(([widgetId, a]) => ({
    widgetId: Number(widgetId),
    ...a,
  }));

  const widgetsArray = widgetArray.sort((a, b) => {
    return b.widgetId - a.widgetId;
  });

  return (
    <>
      <GenericPage
        pageData={{
          subHeader: ['filter'],
          content: [
            {
              type: 'widgets',
              data: widgetsArray.map(({widgetId, ...a}) => ({
                widgetId: Number(widgetId),
                name: a.name,
                iconColor: a.iconColor,
                descr: a.descr,
                ...(a.project
                  ? {
                      project: {
                        projectId: a.project.projectId,
                        projectName: a.project.projectName,
                        projectColor: a.project.projectColor,
                      },
                    }
                  : {}),
                creatorId: a.creatorId,
              })),
            },
          ],
        }}
      />
    </>
  );
};

export default WidgetsPage;
