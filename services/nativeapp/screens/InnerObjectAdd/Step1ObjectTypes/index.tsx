import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../../redux/store';
import {objectTypes} from '../../../shared';
import {View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {setObject} from '../../../redux/functionsDispatch';
import {Cleaning} from '@remrob/mysql';

const ObjectTypeRadio = () => {
  const objectType = useAppSelector(
    (state) => state.cleaning.object.objectType,
  );

  return (
    <RadioButton.Group
      onValueChange={(newValue) => {
        setObject({objectType: newValue as Cleaning['order']['objectType']});
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
