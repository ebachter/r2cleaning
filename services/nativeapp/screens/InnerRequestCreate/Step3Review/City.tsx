import React from 'react';
import {StyleSheet} from 'react-native';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setObjectNew} from '../../../redux/functionsDispatch';
import {EntityObject} from '@remrob/db';

const ix: {id: EntityObject['address_city']; label: string}[] = [
  {id: 'grosny', label: 'Грозный'},
  {id: 'argun', label: 'Аргун'},
  {id: 'gudermes', label: 'Гудермес'},
];

export const MenuComponent = (): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>();
  const city = useAppSelector((state) => state.object.address_city);

  return (
    <Layout style={styles.container} level="1">
      <Select
        selectedIndex={selectedIndex}
        onSelect={(index: IndexPath) => {
          console.log(index, ix[index.row]);
          setSelectedIndex(index);
          setObjectNew({address_city: ix[index.row].id});
        }}
        value={
          Number.isInteger(selectedIndex?.row)
            ? ix[selectedIndex?.row].label
            : 'Select city...'
        }
      >
        {ix.map((v, i) => (
          <SelectItem key={i} title={v.label} />
        ))}
      </Select>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    //minHeight: 128,
  },
});

export default MenuComponent;
