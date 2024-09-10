import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';

const Header = (
  props: {supplierName: string} & ViewProps,
): React.ReactElement => (
  <View {...props}>
    <Text category="h6">Offer</Text>
    <Text category="s1">by {props.supplierName}</Text>
  </View>
);

const Footer = (
  props: ViewProps & {supplierId: number},
): React.ReactElement => (
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
      onPress={() => console.log(props.supplierId)}
    >
      ACCEPT
    </Button>
  </View>
);

export const OfferCard = ({
  supplierId,
  supplierName,
  time,
}: {
  supplierId: number;
  supplierName: string;
  time: string;
}): React.ReactElement => (
  <>
    <Card
      style={styles.card}
      header={(props) => <Header {...props} supplierName={supplierName} />}
      footer={(props) => <Footer {...props} supplierId={supplierId} />}
    >
      <Text>Time: {time}</Text>
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
    maxHeight: 200,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
});
