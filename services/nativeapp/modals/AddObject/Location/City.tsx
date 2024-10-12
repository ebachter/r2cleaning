import React from 'react';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';
import {mergeObject} from '../../../redux/functionsDispatch';
import {trpc} from '../../../trpc';

export const MenuComponent = (): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>();
  // const city = useAppSelector((state) => state.request.object.city);
  const {data: ix} = trpc.master.loadCities.useQuery(undefined, {
    initialData: [],
  });

  return (
    <Layout level="1">
      <Select
        selectedIndex={selectedIndex}
        onSelect={(index: IndexPath) => {
          console.log(index, ix[index.row]);
          setSelectedIndex(index);
          mergeObject({addressCity: ix[index.row].id});
        }}
        value={
          Number.isInteger(selectedIndex?.row)
            ? ix[selectedIndex?.row].nameEn
            : 'Select city...'
        }
      >
        {ix.map((v, i) => (
          <SelectItem key={i} title={v.nameEn} />
        ))}
      </Select>
    </Layout>
  );
};

export default MenuComponent;
