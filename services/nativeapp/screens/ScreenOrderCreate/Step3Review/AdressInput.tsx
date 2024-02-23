import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setAddress} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const address = useAppSelector((state) => state.cleaning.order.address);

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={address}
      onChangeText={(nextValue) => setAddress(nextValue)}
    />
  );
};

export default AdressInput;
