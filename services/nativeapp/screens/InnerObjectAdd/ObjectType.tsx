import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../redux/store';
import {objectTypes} from '../../shared';
import {View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {setObjectNew} from '../../redux/functionsDispatch';
import {Objects} from '@remrob/db';

const ObjectTypeRadio = () => {
  const objectType = useAppSelector((state) => state.object.object_type);

  return (
    <RadioButton.Group
      onValueChange={(newValue: Objects['object_type']) => {
        setObjectNew({object_type: newValue});
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
