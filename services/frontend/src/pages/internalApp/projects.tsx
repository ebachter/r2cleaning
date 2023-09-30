import {MdAdd} from 'react-icons/md';
import {useEffect} from 'react';
import {popupProjectsCreateInit} from '../../popups/popupProjects';
import {usePopupStore} from '../../zustand/popup';
import GenericPage from '../../GenericPage';
import {useAppSelector} from '../../hooks/hooksRedux';
import {GenericPageListItemType} from '../../types/typesGenericPage';
import {callProjectsLoad} from '../../utils/trpcCalls';

function ProjectsPage() {
  useEffect(() => {
    callProjectsLoad();
  }, []);
  const setPopup = usePopupStore((state) => state.setPopup);
  const projects = useAppSelector((state) => state.projects);

  const data: GenericPageListItemType[] = Object.entries(projects).map(
    ([projectId, o]) => ({
      id: Number(projectId),
      link: `/projects/${projectId}`,
      primaryText: o.name,
      secondaryText: `by ${o.username}`,
      primaryTextProjectColor: o.color,
    }),
  );

  return (
    <GenericPage
      pageData={{
        subHeader: [
          'filter',
          // {button: 'ButtonObjectRegisterManual'},
          {
            buttonLabel: 'New project',
            startIcon: MdAdd,
            onClick: () => {
              setPopup(popupProjectsCreateInit());
            },
          },
        ],
        content: [{type: 'list', data}],
      }}
    />
  );
}

export default ProjectsPage;
