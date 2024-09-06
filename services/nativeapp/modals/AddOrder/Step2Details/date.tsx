import React from 'react';
import {StyleSheet} from 'react-native';
import {Datepicker, Layout} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {mergeOrder} from '../../../redux/functionsDispatch';

export const OrderDate = (): React.ReactElement => {
  const orderDate = useAppSelector((state) => state.cleaning.date);

  return (
    <Layout style={styles.container} level="1">
      <Datepicker
        date={orderDate}
        onSelect={(nextDate) => mergeOrder({date: nextDate})}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 376,
  },
});
