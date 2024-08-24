import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../redux/store';
import {objectTypes} from '../../shared';
import {View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {setObjectNew} from '../../redux/functionsDispatch';

import drizzle, {
  object,
  order,
  serviceOffer,
  serviceType,
  user,
} from '@remrob/drizzle';

type ObjectType = typeof object.$inferSelect;

const ObjectTypeRadio = () => {
  const objectType = useAppSelector((state) => state.object.type);

  return (
    <RadioButton.Group
      onValueChange={(newValue: ObjectType['type']) => {
        setObjectNew({type: newValue});
      }}
      value={objectType}
    >
      {objectTypes.map(({id, label}, i) => {
        return (
          <View key={id} style={{flexDirection: 'row', alignContent: 'center'}}>
            <View style={{alignSelf: 'center'}}>
              <RadioButton value={id} />
            </View>
            <View style={{alignSelf: 'center'}}>
              <Text>{label}</Text>
            </View>
          </View>
        );
      })}
    </RadioButton.Group>
  );
};

export {ObjectTypeRadio};
