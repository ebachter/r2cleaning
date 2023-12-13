import React from 'react';
import {Text} from '@ui-kitten/components';
import {useAppSelector} from '../redux/store';
import {objectTypes} from '../shared';
import {View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {Cleaning} from '../types/typesCleaning';
import {setObjectType} from '../redux/functionsDispatch';

const ObjectTypeRadio = () => {
  const objectType = useAppSelector((state) => state.cleaning.objectType);

  return (
    <RadioButton.Group
      onValueChange={(newValue) => {
        setObjectType(newValue as Cleaning['objectType']);
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
