import {StyleSheet, View, Dimensions} from 'react-native';
import City from './Location/City';
import AdressInput from './Location/AdressInput';
import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../../redux/store';
import {setObject} from '../../redux/functionsDispatch';
import {Input} from '@ui-kitten/components';

export const Area = () => {
  const area = useAppSelector((state) => state.cleaning.object.area);

  return (
    <View>
      <View>
        <Text category="label">Area</Text>
      </View>

      {/* <Text style={{marginTop: 20, marginBottom: 10}}>Адрес:</Text> */}
      <Input
        placeholder="0"
        value={area ? `${area}` : ''}
        onChangeText={(nextValue) => {
          const next = nextValue.replace(/\D/g, '') || 0;
          console.log('>>>', nextValue, next);
          // if(next) setObject({area: Number(nextValue)});
          setObject({area: Number(next) || null});
        }}
        accessoryRight={
          <Text>
            m<sup>2</sup>
          </Text>
        }
      />
      {/* <View style={{marginTop: 20}}>
<Text style={styles.captionText}>Object is succesfully created!</Text>
</View> */}
    </View>
  );
};
