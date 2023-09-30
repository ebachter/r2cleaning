import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {trpcComp} from '../../trpc';
import useTypedParams from '../../hooks/useTypedParams';
import {popupProjectDeleteInit} from '../../popups/popupProjects';
import GenericPage from '../../GenericPage';
import {MdCheckCircleOutline, MdRadioButtonUnchecked} from 'react-icons/md';

import {
  popupProjectObjectAdd,
  popupProjectObjectDel,
} from '../../popups/popupProjectObjects';
import {
  popupProjectWidgetAdd,
  popupProjectWidgetRem,
} from '../../popups/popupProjectWidgets';
import {
  popupProjectMemberAdd,
  popupProjectMemberRem,
} from '../../popups/popupProjectMembers';

const ProjectPage = () => {
  const {projectId} = useTypedParams(['projectId']);
  const {data: projectData, refetch} = trpcComp.trpcAppProjectLoad.useQuery({
    projectId,
  });

  /* const project = useSelector(
    (state: RootState) => state.projects[Number(projectId)],
  ); */
  const user_id = useSelector((state: RootState) => state.user.user_id);
  const {users, objects, widgets, project} = projectData || {};
  // const {name, descr, color} = project || {};
  const usersIds = (users || []).map((u) => u.user_fk);
  if (user_id) usersIds.push(user_id);

  const excludeObjects = (objects || []).map((o) => o.object_id);
  const excludeWidgets = (widgets || []).map((o) => o.widget_id);
  const excludeMembers = (users || []).map((o) => o.user_fk);

  return (
    <GenericPage
      pageData={{
        settingsMenu: [
          {
            label: 'Change color',
            onClick: () => {
              alert(123);
            },
          },
          {
            label: 'Delete project',
            onClick: () => {
              popupProjectDeleteInit({projectId});
            },
          },
        ],

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
            type: 'list',
            data: [
              {
                id: Number(projectId),
                primaryText: `${project?.name}`,
                secondaryText: `by ${project?.username}`,
                primaryTextProjectColor: project?.color,
              },
            ],
          },
          {
            type: 'container',
            title: 'Description',
            list: [{primaryText: project?.descr || ''}],
          },
          {
            type: 'container',
            title: 'Access',
            list: [
              {
                primaryText: 'Control',
                action: {
                  actionIconRaw: project?.access_control
                    ? MdCheckCircleOutline
                    : MdRadioButtonUnchecked,
                },
              },
            ],
          },
          {
            type: 'subtitle',
            primary: 'Linked objects',
            menu: [
              {
                text: 'Add object',
                func: () =>
                  popupProjectObjectAdd(projectId, refetch, excludeObjects),
              },
            ],
          },
          {
            type: 'container',
            list: (objects || []).map(({object_id, icon, object_name}) => {
              return {
                id: object_id,
                link: `/objects/${object_id}`,
                startIcon: `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/icons/models/${icon}`,
                primaryText: object_name,
                action: {
                  menu: [
                    {
                      text: 'Remove object',
                      func: () =>
                        popupProjectObjectDel(object_id, object_name, refetch),
                    },
                  ],
                },
              };
            }),
          },
          {
            type: 'subtitle',
            primary: 'Linked widgets',
            menu: [
              {
                text: 'Add widget',
                func: () =>
                  popupProjectWidgetAdd(projectId, refetch, excludeWidgets),
              },
            ],
          },
          {
            type: 'container',
            list: (widgets || []).map(({widget_id, icon_color, name}) => {
              return {
                id: widget_id,
                widget_line_color: icon_color,
                link: `/widgets/${widget_id}`,
                // startIcon: `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/icons/models/${icon}`,
                primaryText: name,
                action: {
                  menu: [
                    {
                      text: 'Remove widget',
                      func: () =>
                        popupProjectWidgetRem(widget_id, name, refetch),
                    },
                  ],
                },
              };
            }),
          },

          {
            type: 'subtitle',
            primary: 'Project members',
            menu: [
              {
                text: 'Add member',
                func: () =>
                  popupProjectMemberAdd(projectId, refetch, excludeMembers),
              },
            ],
          },

          {
            type: 'container',
            list: (users || []).map(
              ({user_fk, usertype, username, user_image_hash, name, ...o}) => {
                return {
                  id: user_fk,
                  avatarType: 'circular',
                  startIcon: `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/users/${user_image_hash}`,
                  primaryText: name,
                  link: `/search/users/${username}`,
                  action: {
                    label: {
                      value: [...(o.access_control ? ['control'] : [])].join(
                        ', ',
                      ),
                    },
                    menu: [
                      {
                        text: 'Remove member',
                        func: () =>
                          popupProjectMemberRem(
                            projectId,
                            user_fk,
                            username,
                            refetch,
                          ),
                      },
                    ],
                  },
                };
              },
            ),
          },
        ],
      }}
    />
  );
};

export default ProjectPage;
