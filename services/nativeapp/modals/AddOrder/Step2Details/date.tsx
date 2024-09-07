import React from 'react';
import {StyleSheet} from 'react-native';
import {Datepicker, Layout} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {mergeOrder} from '../../../redux/functionsDispatch';

export const OrderDate = (): React.ReactElement => {
  const orderDate = useAppSelector((state) => state.cleaning.date);
  const now = new Date();

  return (
    <Layout level="1">
      <Datepicker
        date={orderDate}
        onSelect={(nextDate) => mergeOrder({date: nextDate})}
        placeholder={'Pick a date'}
        min={now}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 376,
  },
});
