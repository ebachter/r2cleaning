import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../redux/store';
// import {objectTypes} from '../../shared';
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
import {trpcComp} from '../../trpc';

type ObjectType = typeof object.$inferSelect;

const ObjectTypeRadio = () => {
  const objectType = useAppSelector((state) => state.object.type);
  const {data: objectTypes} = trpcComp.loadObjectTypes.useQuery(undefined, {
    initialData: [],
  });

  return (
    <RadioButton.Group
      onValueChange={(newValue) => {
        setObjectNew({type: Number(newValue)});
      }}
      value={String(objectType)}
    >
      {objectTypes.map(({id, name: {en: label}}, i) => {
        return (
          <View key={id} style={{flexDirection: 'row', alignContent: 'center'}}>
            <View style={{alignSelf: 'center'}}>
              <RadioButton value={label} />
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
