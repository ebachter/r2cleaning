import {useAppSelector} from '../../../redux/store';
import {View} from 'react-native';
import {mergeOrder, mergeSession} from '../../../redux/functionsDispatch';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';
import {useState} from 'react';
import {trpc} from '../../../trpc';

const ObjectTypeRadio = () => {
  const {id, type} = useAppSelector((state) => state.request.object);

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0),
  );

  const handleMenuItemClick = (index: number) => {
    console.log(index, data[index].id);
  };
  const {data} = trpc.user.loadObjects.useQuery(undefined, {
    initialData: [],
  });

  return (
    <View>
      <View>
        <Select
          style={{width: '100%'}}
          value={
            id && data
              ? `${data[selectedIndex.row].id}. ${
                  data[selectedIndex.row].objectType.name.en
                } in ${data[selectedIndex.row].city.nameEn}`
              : ''
          }
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
            handleMenuItemClick(index.row);
            mergeOrder({
              object: data[index.row],
            });
          }}
          placeholder={'Select object'}
        >
          {data.map((o, i) => (
            <SelectItem
              key={i}
              title={`${o.id}. ${o.objectType.name.en} in ${o.city.nameEn}`}
            />
          ))}
        </Select>
      </View>
    </View>
  );
};

export {ObjectTypeRadio};
