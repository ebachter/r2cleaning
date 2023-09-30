import {GenericPageListItemType} from '../../types/typesGenericPage';
import GenericPage from '../../GenericPage';
import {MdDescription} from 'react-icons/md';
import {useAppSelector} from '../../hooks/hooksRedux';
import {useEffect} from 'react';
import {callAppServicesLoad} from '../../utils/trpcCalls';

function AppServicesPage() {
  const objectsObj = useAppSelector((state) => state.objects);
  const services = useAppSelector((state) => state.services);

  useEffect(() => {
    callAppServicesLoad();
  }, []);

  const listData: GenericPageListItemType[] = Object.entries(services).map(
    ([
      serviceId,
      {
        object_fk,
        services_templates: {service_template_name, color_avatar_background},
      },
    ]) => {
      return {
        id: Number(serviceId),
        primaryText: service_template_name,
        secondaryText: `for [${objectsObj[object_fk]?.object_name}]`,
        link: `/services/${serviceId}`,
        standardIcon: {
          id: 'Description',
          icon: MdDescription,
          colorAvatarBackground: color_avatar_background,
        },
        // project: undefined,
      };
    },
  );

  return (
    <GenericPage
      pageData={{
        header: [],
        subHeader: ['filter'],
        content: [{type: 'list', avatarType: 'square', data: listData}],
      }}
    />
  );
}

export default AppServicesPage;
