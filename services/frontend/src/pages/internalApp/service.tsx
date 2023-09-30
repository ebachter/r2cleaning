import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {popupServiceTerminate} from '../../popups/popupServices';
import GenericPage from '../../GenericPage';
import {trpcComp} from '../../trpc';
import useTypedParams from '../../hooks/useTypedParams';
import {MdDescription} from 'react-icons/md';

const ServicePage = () => {
  const {serviceId} = useTypedParams(['serviceId']);

  const {data: service, refetch} = trpcComp.appGetService.useQuery({
    serviceId: Number(serviceId),
  });

  const objectsObj = useSelector((state: RootState) => state.objects);

  const {
    object_fk,
    service_template_name,
    contract_terms,
    currency,
    subscription_value,
    subscription_frequency,
    created_at,
    terminated_at,
    next_payment_at,
    color_avatar_background,
  } = service?.service || {};

  return (
    <GenericPage
      pageData={{
        settingsMenu: [
          {
            label: 'Terminate',
            onClick: () => {
              popupServiceTerminate({
                serviceId: Number(serviceId),
                serviceName: service_template_name || '',
              });
              /* trpcFunc.reConnectObject.mutate({
                  mqttClientId: o.mqtt_client_id,
                }); */
            },
          },
        ],
        subHeader: [],
        content: [
          {
            type: 'container',
            title: 'Service name',
            list: [
              {
                // id: Number(objectId),
                primaryText: service_template_name || '',
                startAvatar: {
                  // id: 'Description',
                  icon: MdDescription,
                  colorAvatarBackground: color_avatar_background,
                  avatarType: 'square',
                },
              },
            ],
          },
          {
            type: 'container',
            title: 'Subscription',
            list: [
              {
                primaryText:
                  `${subscription_value} - ${currency} - ${subscription_frequency}` ||
                  '',
              },
            ],
          },
          {
            type: 'container',
            title: 'Terms',
            list: [
              {
                primaryText: contract_terms || '',
              },
            ],
          },
          {
            type: 'container',
            title: 'Objects',
            list: [
              {
                link: `/objects/${object_fk}`,
                startAvatar: {
                  startIconUrl:
                    object_fk && objectsObj[object_fk]?.models.icon
                      ? `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/icons/models/${objectsObj[object_fk]?.models.icon}`
                      : undefined,
                },
                primaryText: object_fk
                  ? objectsObj[object_fk]?.object_name
                  : '',
              },
            ],
          },
          {
            type: 'container',
            list: [
              {
                primaryDisplay: {
                  label: 'Next payment time',
                  text: next_payment_at?.toString() || ' ',
                },
              },

              {
                primaryDisplay: {
                  label: 'Creation time',
                  text: created_at?.toString() || ' ',
                },
              },

              {
                primaryDisplay: {
                  label: 'Termination time',
                  text: created_at?.toString() || ' ',
                },
              },
            ],
          },
        ],
      }}
    />
  );
};

export default ServicePage;
