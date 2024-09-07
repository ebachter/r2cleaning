import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../redux/store';
import {View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {mergeObject} from '../../redux/functionsDispatch';
import {trpcComp} from '../../trpc';

const ObjectTypeRadio = () => {
  const objectType = useAppSelector((state) => state.object.type);
  const {data: objectTypes} = trpcComp.loadObjectTypes.useQuery(undefined, {
    initialData: [],
  });

  return (
    <RadioButton.Group
      onValueChange={(newValue) => {
        mergeObject({type: Number(newValue)});
      }}
      value={String(objectType)}
    >
      {objectTypes.map(({id, name: {en: label}}, i) => {
        return (
          <View key={i} style={{flexDirection: 'row', alignContent: 'center'}}>
            <View style={{alignSelf: 'center'}}>
              <RadioButton value={String(id)} />
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
