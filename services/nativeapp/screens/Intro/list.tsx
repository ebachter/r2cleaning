import {useNavigation} from '@react-navigation/native';
import {ReactElement} from 'react';
import {trpc} from '../../trpc';
import CardComponent from './card';

export const ListOfOrders = (): ReactElement => {
  const {data} = trpc.user.orders.get.all.useQuery(undefined, {
    initialData: [],
  });

  const navigation = useNavigation();

  return (
    <>
      {data.map((o, i) => (
        <CardComponent
          key={i}
          objectType={o.objectTypes.name.en}
          orderId={o.requests.id}
          data={o}
        />
      ))}
    </>
  );
};
