import {callAppWidgetsLoad} from '../../utils/trpcCalls';
import {useEffect} from 'react';
import useTypedParams from '../../hooks/useTypedParams';
import GenericPage from '../../GenericPage';
import {setWidgetFullScreen} from '../../zustand/utils';
import {pushRoute} from '../../router/helpers';
import {useAppSelector} from '../../hooks/hooksRedux';
import {GenericPageChat} from '../../types/typesGenericPage';
import {MdFullscreen, MdInfo} from 'react-icons/md';

const WidgetPage = () => {
  useEffect(() => {
    callAppWidgetsLoad();
  }, []);

  const {widgetId} = useTypedParams(['widgetId']);
  const widget = useAppSelector((state) => state.widgets[widgetId]);

  const widgetProjectId = widget?.project?.projectId;

  return (
    <>
      <GenericPage
        pageData={{
          settingsMenu: [
            {
              label: 'Fullscreen',
              icon: MdFullscreen,
              onClick: () => {
                setWidgetFullScreen(true);
              },
            },
            {
              label: 'Settings',
              icon: MdInfo,
              onClick: () => {
                pushRoute(`/widgets/${widgetId}/settings`);
              },
            },
          ],
          content: [
            {type: 'subtitle', primary: widget?.name},
            {
              type: 'iframe',
              url: `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/widgets/${widget?.widgetTemplateId}/index.html`,
              widgetId,
              // sendDataToFrame: (sendToFrame) => {},
            },
            ...(widgetProjectId
              ? [
                  {
                    type: 'chat',
                    projectId: widgetProjectId,
                    // chatImage: null,
                    // setChatImage: (null) => console.log('qwer')
                  } as GenericPageChat,
                ]
              : []),
          ],
        }}
      />
    </>
  );
};

export default WidgetPage;
