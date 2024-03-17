import {Text, View} from 'react-native';
import ComponentObjectType from '../componentObjectType';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';
import {useState} from 'react';
import {OrderKitchen} from './OrderKitchen';
import {OrderBathroom} from './OrderBathroom';
import {useAppSelector} from '../../../../redux/store';
import {setRoomNumberOfAppartment} from '../../../../redux/functionsDispatch';

const data = [1, 2, 3, 4, 5, 6, 7];

export default function ObjectDetails() {
  const numberOfRooms = useAppSelector(
    (state) => state.cleaning.order.options.appartment.numberOfRooms,
  );
  const handleMenuItemClick = (index: number) => {
    setRoomNumberOfAppartment(index);
  };

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0),
  );

  return (
    <View>
      <Text style={{marginBottom: 20}}>
        <ComponentObjectType />
      </Text>
      <Text style={{marginTop: 20, marginBottom: 10}}>
        Количество комнат (x2000р.)
      </Text>
      <View>
        <Select
          selectedIndex={selectedIndex}
          onSelect={(index: IndexPath) => {
            setSelectedIndex(index);
            handleMenuItemClick(data[index.row]);
          }}
          value={numberOfRooms.number}
        >
          {data.map((v, i) => (
            <SelectItem key={i} title={v} />
          ))}
        </Select>
      </View>
      <Text style={{marginTop: 20, marginBottom: 10}}>Кухня</Text>
      <View>
        <OrderKitchen />
      </View>
      <Text style={{marginTop: 20, marginBottom: 10}}>Ванная</Text>
      <View>
        <OrderBathroom />
      </View>
    </View>
  );
}
