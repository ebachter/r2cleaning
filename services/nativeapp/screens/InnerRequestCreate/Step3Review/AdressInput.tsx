import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setObjectNew} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const address = useAppSelector((state) => state.object.address_street);

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={address}
      onChangeText={(nextValue) => setObjectNew({address_street: nextValue})}
    />
  );
};

export default AdressInput;
