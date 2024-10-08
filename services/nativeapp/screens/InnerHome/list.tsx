import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {ReactElement} from 'react';
import {List, MD3Colors} from 'react-native-paper';
import {trpc} from '../../trpc';
import CardComponent from './card';

export const ListOfOrders = (): ReactElement => {
  const {data} = trpc.user.loadOrders.useQuery(undefined, {
    initialData: [],
  });

  const navigation = useNavigation();

  return (
    <>
      {data.map((o, i) => (
        <CardComponent
          key={i}
          objectType={o.objectType.name.en}
          orderId={o.request.id}
          data={o}
        />
      ))}
    </>
  );
};
