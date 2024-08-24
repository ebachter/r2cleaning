import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {setObjectNew} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const {addressStreet} = useAppSelector((state) => state.object);

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={addressStreet}
      onChangeText={(nextValue) => setObjectNew({addressStreet: nextValue})}
    />
  );
};

export default AdressInput;
