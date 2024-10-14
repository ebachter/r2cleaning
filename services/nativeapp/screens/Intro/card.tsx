import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Text} from 'react-native-paper';
import {RouterOutputs} from '@remrob/api';

const LeftContent = (props) => (
  <Icon {...props} source={require('../../assets/cleaning_icon.png')} />
);

const CardComponent = ({
  orderId,
  objectType,
  data,
}: {
  orderId: number;
  objectType: string;
  data: RouterOutputs['user']['order']['get']['all'][number];
}) => {
  const navigation = useNavigation();

  return (
    <Card
      style={{width: '100%', maxHeight: 300, marginTop: 5, marginBottom: 5}}
      onPress={() => navigation.navigate('OrderDetails', {orderId: orderId})}
    >
      <Card.Title
        title={`Order ${orderId}`}
        subtitle={`Status: ${
          data.order
            ? 'Accepted order'
            : data.offerCount
            ? 'Offers received'
            : 'Waiting for offers...'
        }`}
        left={LeftContent}
      />
      <Card.Content>
        <Text variant="titleMedium">{`Object: ${objectType} in ${data.city.nameEn}`}</Text>
        <Text variant="titleMedium">{`Address: ${data.object.addressStreet}`}</Text>
        <Text variant="bodyMedium">{`Offers: ${
          data.offerCount?.count || 0
        } offer(s)`}</Text>
      </Card.Content>
      {/* <Card.Cover source={{uri: 'https://picsum.photos/700'}} /> */}
      <Card.Actions>
        {!data.order && <Button mode="text">Cancel</Button>}
        {/* <Button>Ok</Button> */}
      </Card.Actions>
    </Card>
  );
};

export default CardComponent;
