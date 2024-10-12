import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Text} from 'react-native-paper';
import {RouterOutputs} from '../../trpc';

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
      onPress={() =>
        navigation.navigate('SupplierRequest', {orderId: String(orderId)})
      }
    >
      <Card.Title
        title={`Order ${orderId} for ${data.objectType.name.en}`}
        subtitle={`Status: ${data.order ? 'Accepted order' : 'Offer sent'}`}
        left={LeftContent}
      />
      <Card.Content>
        <Text variant="titleLarge">{`${objectType} in ${data.object.addressCity} ${data.object.addressStreet}`}</Text>
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
