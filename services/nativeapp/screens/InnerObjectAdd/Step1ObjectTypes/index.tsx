import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {objectTypes} from '../../../shared';
import {View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {setObject} from '../../../redux/functionsDispatch';
import {Cleaning} from '@remrob/mysql';
import {Objects} from '@remrob/db';

const ObjectTypeRadio = () => {
  const objectType = useAppSelector(
    (state) => state.cleaning.object.object_type,
  );

  return (
    <RadioButton.Group
      onValueChange={(newValue) => {
        setObject({object_type: newValue as Objects['object_type']});
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
