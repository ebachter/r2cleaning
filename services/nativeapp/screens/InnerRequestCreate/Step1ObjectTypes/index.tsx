import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {objectTypes} from '../../../shared';
import {View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {setObjectType, setOrder} from '../../../redux/functionsDispatch';
import {Cleaning} from '@remrob/mysql';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';
import {useState} from 'react';
import {trpcComp} from '../../../trpc';

const ObjectTypeRadio = () => {
  const objectType = useAppSelector((state) => state.cleaning.order.objectType);
  const objectId = useAppSelector((state) => state.cleaning.order.objectId);
  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0),
  );

  // const [objectId, setObjectId] = useState<number | null>(null);

  const handleMenuItemClick = (index: number) => {
    console.log(index, data[index].object_id);
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
            objectId
              ? `${data[selectedIndex.row].object_id}. ${
                  data[selectedIndex.row].object_type
                }`
              : ''
          }
          // label={'Select object'}
          // selectedIndex={selectedIndex}
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
            handleMenuItemClick(index.row);
            // setObjectId(data[index.row].object_id);
            setOrder({
              objectId: data[index.row].object_id,
              objectType: data[index.row].object_type,
            });
          }}
          placeholder={'Select object'}
        >
          {(data || []).map((o, i) => (
            <SelectItem key={i} title={`${o.object_id}. ${o.object_type}`} />
          ))}
        </Select>
      </View>
    </View>
  );
};

export {ObjectTypeRadio};