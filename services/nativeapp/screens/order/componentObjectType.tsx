// import {Typography} from '@mui/material';
import {Text} from 'react-native-paper';
import {useAppSelector} from '../../redux/store';
import {objectTypes} from '../../shared';

export default function ComponentObjectType() {
  const objectType = useAppSelector((state) => state.cleaning.objectType);
  return (
    <>
      <Text>
        Тип объекта: {objectTypes.find((o) => o.id === objectType)?.label}
      </Text>
    </>
  );
}
