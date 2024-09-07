import {Input} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {mergeObject} from '../../../redux/functionsDispatch';

const AdressInput = () => {
  const {addressStreet} = useAppSelector((state) => state.object);

  return (
    <Input
      placeholder="Введите ваш адрес"
      value={addressStreet}
      onChangeText={(nextValue) => mergeObject({addressStreet: nextValue})}
    />
  );
};

export default AdressInput;
