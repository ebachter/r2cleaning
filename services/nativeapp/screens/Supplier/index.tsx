import {useNavigation} from '@react-navigation/native';
import SupplierFab from './Fab';
import {trpcComp} from '../../trpc';
import CardComponent from './card';
import {Text} from 'react-native-paper';

export default function ScreenSuppler() {
  const navigation = useNavigation();

  const {data} = trpcComp.user.loadOrdersOfSupplier.useQuery(undefined, {
    initialData: [],
  });

  console.log('>>>', data);

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
