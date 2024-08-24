import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setObjectNew} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const address = useAppSelector((state) => state.object.addressStreet);

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={address}
      onChangeText={(nextValue) => setObjectNew({addressStreet: nextValue})}
    />
  );
};

export default AdressInput;
