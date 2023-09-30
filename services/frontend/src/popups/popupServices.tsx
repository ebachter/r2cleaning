import {closePopup, setPopup} from '../zustand/popup';
import {replaceRoute} from '../router/helpers';
import {trpcFunc} from '../trpc';
import {callAppServicesLoad} from '../utils/trpcCalls';

export const popupServiceTerminate = ({
  serviceId,
  serviceName,
}: {
  serviceId: number;
  serviceName: string;
}) =>
  setPopup({
    open: true,
    mandatory: false,
    loading: false,
    header: 'Terminate service',
    content: [
      {
        type: 'info',
        elemKey: 'info1',
        bodyText: `Do you want to terminate the service [${serviceId}] ${serviceName}?`,
      },
    ],
    buttons: [
      {type: 'cancel', elemKey: 'cancel'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        variant: 'outlined',
        labelText: 'Terminate',
        onClick: async () => {
          const {status} = await trpcFunc.appContractTerminate.mutate({
            serviceId: Number(serviceId),
          });

          if (status === 204) {
            callAppServicesLoad();
            replaceRoute('/services');
            closePopup();
          }
        },
      },
    ],
  });
