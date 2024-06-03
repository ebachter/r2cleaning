import {StyleSheet} from 'react-native';
import {CheckBox} from '@ui-kitten/components';
import {store, useAppSelector} from '../../../../redux/store';
import {setKitchenOfAppartment} from '../../../../redux/functionsDispatch';
import {ReactElement} from 'react';

type TypesKitchen = 'all' | 'sink' | 'refrigerator' | 'oven';

export const OrderKitchen = (): ReactElement => {
  const appartment = useAppSelector(
    (state) => state.cleaning.order.options.appartment.kitchen,
  );
  const {dispatch} = store;

  const handleChange = (checked, name): void => {
    const newState = structuredClone(appartment);
    newState[name as TypesKitchen].value = checked;
    dispatch(setKitchenOfAppartment(newState));
  };

  const handleAllChange = (checked: boolean): void => {
    const newState = structuredClone(appartment);
    const indeterminate = [
      newState.oven.value,
      newState.refrigerator.value,
      newState.sink.value,
    ].some((v) => v === true);

    newState.all.value = indeterminate ? false : checked;
    newState.oven.value = indeterminate ? false : checked;
    newState.refrigerator.value = indeterminate ? false : checked;
    newState.sink.value = indeterminate ? false : checked;
    setKitchenOfAppartment(newState);
  };

  return (
    <>
      <CheckBox
        style={styles.group}
        checked={
          appartment.sink.value &&
          appartment.refrigerator.value &&
          appartment.oven.value
        }
        indeterminate={
          (!(
            appartment.sink.value &&
            appartment.refrigerator.value &&
            appartment.oven.value
          ) &&
            (appartment.sink.value ||
              appartment.refrigerator.value ||
              appartment.oven.value)) ||
          undefined
        }
        onChange={handleAllChange}
      >
        Выбрать все
      </CheckBox>
      <CheckBox
        style={styles.option}
        checked={appartment.sink.value}
        onChange={(e) => handleChange(e, 'sink')}
      >
        {`Мойка (${appartment.sink.price}р.)`}
      </CheckBox>
      <CheckBox
        style={styles.option}
        checked={appartment.refrigerator.value}
        onChange={(e) => handleChange(e, 'refrigerator')}
      >
        {`Холодильник (${appartment.refrigerator.price}р.)`}
      </CheckBox>
      <CheckBox
        style={styles.option}
        checked={appartment.oven.value}
        onChange={(e) => handleChange(e, 'oven')}
      >
        {`Печь (${appartment.oven.price}р.)`}
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
