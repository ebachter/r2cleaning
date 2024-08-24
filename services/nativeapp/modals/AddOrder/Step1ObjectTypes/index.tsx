import {useAppSelector} from '../../../redux/store';
import {View} from 'react-native';
import {mergeOrder, mergeSession} from '../../../redux/functionsDispatch';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';
import {useState} from 'react';
import {trpcComp} from '../../../trpc';

const ObjectTypeRadio = () => {
  const {object_id, object_type} = useAppSelector(
    (state) => state.cleaning.object,
  );

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0),
  );

  // const [objectId, setObjectId] = useState<number | null>(null);

  const handleMenuItemClick = (index: number) => {
    console.log(index, data[index].id);
    // setRoomNumberOfAppartment(index);
  };

  const {data} = trpcComp.loadObjects.useQuery();
  console.log('###', data);

  return (
    <View>
      <View>
        <Select
          style={{width: '100%'}}
          value={
            object_id && data
              ? `${data[selectedIndex.row].id}. ${
                  data[selectedIndex.row].type
                } in ${data[selectedIndex.row].addressCity}`
              : ''
          }
          // label={'Select object'}
          // selectedIndex={selectedIndex}
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
            handleMenuItemClick(index.row);
            // setObjectId(data[index.row].object_id);
            mergeOrder({
              object: {
                object_id: data[index.row].id,
                object_type: data[index.row].type,
                address_street: data[index.row].addressStreet,
                address_city: data[index.row].addressCity,
                area: Number(data[index.row].area),
              },
            });
            /* setOrder({
              object: {
                object_id: data[index.row].object_id,
                object_type: data[index.row].object_type,
                address_street: data[index.row].address_street,
                address_city: data[index.row].address_city,
                area: data[index.row].area,
              },
            }); */
          }}
          placeholder={'Select object'}
        >
          {(data || []).map((o, i) => (
            <SelectItem
              key={i}
              title={`${o.id}. ${o.type} in ${o.addressCity}`}
            />
          ))}
        </Select>
      </View>
    </View>
  );
};

export {ObjectTypeRadio};
