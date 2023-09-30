import {ProjectChat} from '../../components/ProjectChat';
import useTypedParams from '../../hooks/useTypedParams';
import {useAppSelector} from '../../hooks/hooksRedux';
import GenericPage from '../../GenericPage';

const ProjectChatPage = () => {
  const {projectId} = useTypedParams(['projectId']);

  const topic = useAppSelector((state) => state.projects[Number(projectId)]);

  return (
    <GenericPage
      pageData={{
        header: [],
        subHeader: [],

        content: [
          {
            type: 'tabs',
            data: [
              {
                label: 'Details',
                link: `/projects/${projectId}`,
                path: '/projects/:projectId',
                // icon: <SettingsInputComponentIcon />,
              },
              {
                label: 'Chat',
                link: `/projects/${projectId}/chat`,
                path: '/projects/:projectId/chat',
                // icon: <SettingsIcon />,
              },
            ],
          },
          {
            type: 'subtitle',
            primary: `Project: ${topic.name}`,
          },
          {
            type: 'customComponent',
            value: () => <ProjectChat projectId={projectId} />,
          },
        ],
      }}
    />
  );
};

export default ProjectChatPage;
