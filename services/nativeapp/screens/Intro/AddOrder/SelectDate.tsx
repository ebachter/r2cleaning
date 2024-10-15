import React from 'react';
import {StyleSheet} from 'react-native';
import {Datepicker, Layout} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {mergeOrder} from '../../../redux/functionsDispatch';

export const SelectDate = (): React.ReactElement => {
  const orderDate = useAppSelector((state) => state.request.date);
  const now = new Date();

  return (
    <Datepicker
      label={'Pick a date'}
      date={orderDate}
      onSelect={(nextDate) => mergeOrder({date: nextDate})}
      placeholder={'Pick a date'}
      min={now}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 376,
  },
});
