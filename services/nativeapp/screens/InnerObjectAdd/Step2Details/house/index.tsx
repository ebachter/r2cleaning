import {Text, View} from 'react-native';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';
import {useState} from 'react';
import {OrderKitchen} from './OrderKitchen';

const data = ['1', '2', '3'];

export default function House() {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0),
  );
  const displayValue = data[selectedIndex.row];

  return (
    <View>
      <Text style={{marginTop: 20, marginBottom: 10}}>
        Количество комнат (x2000р.)
      </Text>
      <View>
        <Select
          selectedIndex={selectedIndex}
          onSelect={(index: IndexPath) => {
            console.log('*ix', index);
            setSelectedIndex(index);
          }}
          value={displayValue}
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
    </View>
  );
}
