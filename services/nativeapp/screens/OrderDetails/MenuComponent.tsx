import React from 'react';
import {StyleSheet} from 'react-native';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';

const ix = [
  {id: 'grosny', label: 'Грозный'},
  {id: 'argun', label: 'Аргун'},
  {id: 'gudermes', label: 'Гудермес'},
];

export const MenuComponent = (): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(
    new IndexPath(0),
  );

  return (
    <Layout style={styles.container} level="1">
      <Select
        selectedIndex={selectedIndex}
        onSelect={(index: IndexPath) => {
          setSelectedIndex(index);
        }}
        value={ix[selectedIndex.row].label}
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
    minHeight: 128,
  },
});

export default MenuComponent;
