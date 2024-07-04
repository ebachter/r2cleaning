import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setObjectNew} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const {address_street, address_city} = useAppSelector(
    (state) => state.object,
  );

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={address_street}
      onChangeText={(nextValue) => setObjectNew({address_street: nextValue})}
    />
  );
};

export default AdressInput;
