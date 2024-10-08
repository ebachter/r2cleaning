import SupplierFab from './Fab';
import {trpc} from '../../trpc';
import CardComponent from './card';
import {Text} from 'react-native-paper';

export default function ScreenSuppler() {
  const {data} = trpc.user.loadOrdersOfSupplier.useQuery(undefined, {
    initialData: [],
  });

  return (
    <>
      <Text variant="headlineSmall" style={{marginTop: 20}}>
        Jobs
      </Text>
      {data.map((o, i) => (
        <CardComponent
          key={i}
          objectType={o.objectType.name.en}
          orderId={o.request.id}
          data={o}
        />
      ))}
      <SupplierFab />
    </>
  );
}
