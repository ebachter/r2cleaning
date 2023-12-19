import {StyleSheet} from 'react-native';
import {CheckBox} from '@ui-kitten/components';
import {store, useAppSelector} from '../../../redux/store';
import {
  setBathroomOfAppartment,
  setKitchenOfAppartment,
} from '../../../redux/functionsDispatch';
import {ReactElement} from 'react';

type TypesKitchen = 'all' | 'sink' | 'refrigerator' | 'oven';

export const OrderBathroom = (): ReactElement => {
  const handleChange = (event): void => {
    setBathroomOfAppartment(event);
  };
  const bathroom = useAppSelector(
    (state) => state.cleaning.order.appartment.bathroom,
  );

  return (
    <>
      <CheckBox
        style={styles.group}
        checked={bathroom.value}
        onChange={handleChange}
      >
        {`Выбрать (${bathroom.price}р.)`}
      </CheckBox>
    </>
  );
};

export const styles = StyleSheet.create({
  group: {
    marginVertical: 4,
  },
  option: {
    marginVertical: 4,
    marginHorizontal: 12,
  },
});
