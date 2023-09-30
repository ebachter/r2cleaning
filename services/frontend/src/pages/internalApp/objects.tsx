import {useEffect} from 'react';
import GenericPage from '../../GenericPage';
import {GenericPageListItemType} from '../../types/typesGenericPage';
import {callAppObjectsLoad} from '../../utils/trpcCalls';
import {useAppSelector} from '../../hooks/hooksRedux';
import {MdAdd} from 'react-icons/md';
import {popupRegisterObjectManual} from '../../popups/popupObjectRegister';

const ObjectsPage = () => {
  const objectsObj = useAppSelector((state) => state.objects);
  const liveData = useAppSelector((state) => state.live); // || dataInitialObjectLive;

  useEffect(() => {
    callAppObjectsLoad();
  }, []);

  /*   const objects = Object.entries(objectsObj)
    .filter(([objectId, obj]) => {
      if (filterValue) {
        if (
          obj.object_name.includes(filterValue) ||
          String(obj.model_fk).includes(filterValue) ||
          objectId.includes(filterValue)
        ) {
          return true;
        }
      } else {
        return true;
      }
      return false;
    })
    .map(([objectId, obj]) => ({objectId, ...obj}));

  objects.sort(
    (a, b) =>
      -1 * a.objectId.localeCompare(b.objectId, undefined, {numeric: true}),
  ); */

  const listData: GenericPageListItemType[] = Object.entries(objectsObj).map(
    ([objectId, o]) => ({
      id: Number(objectId),
      link: `/objects/${objectId}`,
      primaryText: o.object_name,
      customIcon: o.models.icon,
      connection: liveData[objectId] ? 'Connected' : 'Not connected',
      project: o.projects,
      secondaryCircleColor: liveData[objectId] ? 'green' : 'silver',
    }),
  );

  return (
    <GenericPage
      pageData={{
        subHeader: [
          'filter',
          {
            buttonLabel: 'Register',
            startIcon: MdAdd,
            onClick: () => {
              popupRegisterObjectManual();
            },
          },
        ],
        content: [{type: 'list', data: listData}],
      }}
    />
  );
};

export default ObjectsPage;
