import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';
import {trpc} from '../../trpc';
import {showSnackbar} from '../../redux/functionsDispatch';

const Header = (
  props: {supplierName: string} & ViewProps,
): React.ReactElement => (
  <View {...props}>
    <Text category="h6">Offer</Text>
    <Text category="s1">by {props.supplierName}</Text>
  </View>
);

const Footer = (props: ViewProps & {offerId: number}): React.ReactElement => {
  const order = trpc.user.order.accept.useMutation({
    onSuccess(data) {
      showSnackbar({text: `Order accepted`});
    },
  });
  return (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
      <Button style={styles.footerControl} size="small" status="basic">
        REJECT
      </Button>
      <Button
        style={styles.footerControl}
        size="small"
        onPress={() => order.mutate({offerId: props.offerId})}
      >
        ACCEPT
      </Button>
    </View>
  );
};

export const OfferCard = ({
  price,
  supplierName,
  time,
  offerId,
  status,
}: {
  offerId: number;
  supplierName: string;
  price: string;
  time: string;
  status: string;
}): React.ReactElement => (
  <>
    <Card
      style={styles.card}
      header={(props) => <Header {...props} supplierName={supplierName} />}
      footer={(props) => <Footer {...props} offerId={offerId} />}
    >
      <Text>Time: {time}</Text>
      <Text>Price: {price}</Text>
      <Text>Status: {status}</Text>
    </Card>
  </>
);

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 2,
    maxHeight: 230,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
});
