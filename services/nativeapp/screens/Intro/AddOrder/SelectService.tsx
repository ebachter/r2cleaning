import React, {useCallback, useEffect, useState} from 'react';
import {Autocomplete, AutocompleteItem} from '@ui-kitten/components';
import {trpc} from '../../../trpc';
import {mergeOrder} from '../../../redux/functionsDispatch';
import {View} from 'react-native';

const filter = (item, query): boolean => {
  return item.toLowerCase().includes(query.toLowerCase());
};

export const AutocompleteElem = (): React.ReactElement => {
  // workaround for autocomplete width
  // https://github.com/akveo/react-native-ui-kitten/issues/1736
  const [width, setWidth] = useState(100);
  const handleWidth = (event) => {
    const {width} = event.nativeEvent.layout;
    setWidth(width);
  };

  const {data: data2} = trpc.master.loadServiceTypes.useQuery();

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
      mergeOrder({service: {type: data5[index].id, label: data5[index].title}});
    },
    [data5],
  );

  const onChangeText = useCallback(
    (query: string, dataOriginal: typeof data2): void => {
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
    <View style={{width: '100%'}} onLayout={handleWidth}>
      <Autocomplete
        label={'Select service'}
        style={{width}}
        placeholder="Service"
        value={value}
        placement="inner top"
        onSelect={onSelect}
        onChangeText={(query) => onChangeText(query, data2)}
      >
        {data5
          // .map((o) => ({id: o.service_type_id, title: o.serviceName.en}))
          .map(renderOption)}
      </Autocomplete>
    </View>
  );
};
