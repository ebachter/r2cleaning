import React, {useState} from 'react';
import {TouchableWithoutFeedback, StyleSheet, View} from 'react-native';
import {Icon, IconElement, Input, Text} from '@ui-kitten/components';
import CountryFlag from 'react-native-country-flag';
import {phone} from 'phone';
import {useAppSelector} from '../../redux/store';
import {setPhone} from '../../redux/functionsDispatch';

const AlertIcon = (props): IconElement => {
  const {marginRight, ...rest} = props;
  return (
    <View {...marginRight}>
      <Icon {...rest} name="alert-circle-outline" />
    </View>
  );
};

const PhoneNumberInput = (): React.ReactElement => {
  const [isPhoneValid, setPhoneValid] = useState(false);
  const phoneNumber = useAppSelector(
    (state) => state.cleaning.order.review.phone,
  );

  const renderIcon = (props): React.ReactElement => (
    <TouchableWithoutFeedback onPress={() => console.log('>>>')}>
      <View>
        {/* <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} /> */}
        <CountryFlag isoCode="ru" size={20} />
      </View>
    </TouchableWithoutFeedback>
  );

  const renderCaption = (): React.ReactElement => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>Enter your real phone number</Text>
      </View>
    );
  };

  return (
    <Input
      value={phoneNumber}
      label="Номер телефона:"
      placeholder="Введите номер"
      caption={renderCaption}
      accessoryLeft={renderIcon}
      onChangeText={(nextValue) => {
        if (/^\+[\d]*$/.test(nextValue)) setPhone(nextValue);
        setPhoneValid(phone(nextValue).isValid);
        console.log(nextValue, phone(nextValue));
      }}
    />
  );
};

const styles = StyleSheet.create({
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'opensans-regular',
    color: '#8F9BB3',
  },
});

export {PhoneNumberInput};
