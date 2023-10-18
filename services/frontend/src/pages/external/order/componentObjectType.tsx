import {Typography} from '@mui/material';
import {useAppSelector} from '../../../hooks/hooksRedux';
import {objectTypes} from './shared';

export default function ComponentObjectType() {
  const objectType = useAppSelector((state) => state.cleaning.objectType);
  return (
    <>
      <div>
        <Typography variant="caption">
          Тип объекта: {objectTypes.find((o) => o.id === objectType)?.label}
        </Typography>
      </div>
    </>
  );
}
