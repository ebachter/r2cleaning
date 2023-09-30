import {getAppState} from '../redux/store';
import {trpcFunc} from '../trpc';
import {PopupAutocommplete} from '../types/typesPopup';
import {callAppServicesLoad} from '../utils/trpcCalls';
import {closePopup, setPopup} from '../zustand/popup';

export const popupSearchServiceOrder = async (
  serviceTemplateId: number,
  serviceTemplateName: string,
  models: number[],
) => {
  const data = await trpcFunc.searchService.query(Number(serviceTemplateId));
  const services = getAppState().services;

  const excludeObjects = (Object.entries(services) || []).reduce(
    (n, [, o]) =>
      o.service_template_fk === serviceTemplateId ? [...n, o.object_fk] : n,
    [] as number[],
  );

  const {serviceTemplate} = data;
  const {activation_configuration} = serviceTemplate || {};

  const objectsObj = getAppState().objects;
  const objectsPrepared = Object.entries(objectsObj).reduce(
    (n, [objectId, o]) => {
      if (models.includes(o.model_fk)) {
        return n;
      } else {
        if (!excludeObjects.includes(Number(objectId)))
          n.push({
            id: objectId,
            label: o.object_name,
          });
        return n;
      }
    },
    [] as PopupAutocommplete['options'],
  );

  setPopup({
    open: true,
    mandatory: true,
    header: 'Service order',
    loading: false,
    content: [
      {
        type: 'info',
        bodyText: serviceTemplateName || '',
      },
      ...(Array.isArray(activation_configuration.elements)
        ? activation_configuration.elements.map((elem) => {
            if ('input' in elem) {
              return {
                type: 'input' as 'input',
                elemKey: elem.input.key,
                labelText: elem.input.label,
                /* setOnChange: (v: string) => {
                  console.log('#', v);
                }, */
              };
            } else {
              return {
                type: 'input' as 'input',
                elemKey: 'dummyKey',
                labelText: elem.textfield.label,
                disabled: true,
              };
            }
          })
        : []),
      {
        type: 'sectionHeader',
        text: `Select an object for the service`,
      },
      {
        type: 'autocomplete',
        elemKey: 'objectId',
        label: 'Select object',
        value: null,
        initialValue: '',
        options: objectsPrepared,
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('objectId', val);
        },
      },
      {
        type: 'checkbox',
        elemKey: `accepted`,
        label: 'I consent to all terms and conditions',
        value: false,
        onChange: (val, {setPopupElementValue}) => {
          setPopupElementValue(`accepted`, val);
        },
      },
    ],
    buttons: [
      {type: 'close', elemKey: 'closeButton'},
      {
        type: 'confirmWithInput',
        labelText: 'Add',
        variant: 'outlined',
        onClick: async (allValues): Promise<void> => {
          const vals = (activation_configuration?.elements || []).reduce(
            (n, o) => {
              if ('input' in o)
                return {...n, [o.input.key]: allValues[o.input.key]};
              else return n;
            },
            {} as {[k: string]: string},
          );

          await trpcFunc.appContractSign.mutate({
            contract_template_id: Number(serviceTemplateId),
            object_id: Number(allValues.objectId),
            accepted: allValues.accepted,
            dynamicData: vals,
          });
          callAppServicesLoad();
          closePopup();
        },
      },
    ],
  });
};
