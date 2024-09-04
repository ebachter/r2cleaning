import React, {useCallback, useEffect} from 'react';
import {Autocomplete, AutocompleteItem} from '@ui-kitten/components';
import {trpcComp} from '../../trpc';
import {mergeOrder} from '../../redux/functionsDispatch';

const filter = (item, query): boolean => {
  return item.toLowerCase().includes(query.toLowerCase());
};

export const AutocompleteElem = (): React.ReactElement => {
  const {data: data2} = trpcComp.loadServiceTypes.useQuery();

  const [value, setValue] = React.useState('');
  const [data5, setData] = React.useState([]);

  useEffect(() => {
    const temp = (data2 || []).map((o) => ({
      id: o.id,
      title: o.name.en,
    }));
    setData(temp);
  }, [data2]);

  const onSelect = useCallback(
    (index): void => {
      setValue(data5[index].title);
      mergeOrder({serviceType: data5[index].id});
    },
    [data5],
  );

  const onChangeText = useCallback(
    (query: string, dataOriginal: typeof data2): void => {
      console.log('>>>', dataOriginal);
      setValue(query);
      setData(
        (dataOriginal || [])
          .map((o) => ({id: o.id, title: o.name.en}))
          .filter((item) => filter(item.title, query)),
      );
    },
    [],
  );

  const renderOption = (item, index): React.ReactElement => (
    <AutocompleteItem key={index} title={item.title} />
  );

  return (
    <Autocomplete
      placeholder="Place your Text"
      value={value}
      placement="inner top"
      onSelect={onSelect}
      onChangeText={(query) => onChangeText(query, data2)}
    >
      {data5
        // .map((o) => ({id: o.service_type_id, title: o.serviceName.en}))
        .map(renderOption)}
    </Autocomplete>
  );
};
