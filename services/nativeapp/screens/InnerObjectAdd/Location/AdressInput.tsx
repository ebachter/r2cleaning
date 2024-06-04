import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setObject} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const address = useAppSelector((state) => state.cleaning.object.address);

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={address}
      onChangeText={(nextValue) => setObject({address: nextValue})}
    />
  );
};

export default AdressInput;
