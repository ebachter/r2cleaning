import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setObject} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const {address_street, address_city} = useAppSelector(
    (state) => state.cleaning.object,
  );

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={address_street}
      onChangeText={(nextValue) => setObject({address_street: nextValue})}
    />
  );
};

export default AdressInput;
