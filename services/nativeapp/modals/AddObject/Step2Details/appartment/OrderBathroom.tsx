import {StyleSheet} from 'react-native';
import {CheckBox} from '@ui-kitten/components';
import {store, useAppSelector} from '../../../../redux/store';
import {mergeObject} from '../../../../redux/functionsDispatch';
import {ReactElement} from 'react';

// type TypesKitchen = 'all' | 'sink' | 'refrigerator' | 'oven';

export const OrderBathroom = (): ReactElement => {
  const handleChange = (event): void => {
    mergeObject({options: {appartment: {bathroom: event}}});
  };
  const bathroom = useAppSelector(
    (state) => state.object.options.appartment.bathroom,
  );

  return (
    <>
      <CheckBox
        style={styles.group}
        checked={bathroom.include}
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
