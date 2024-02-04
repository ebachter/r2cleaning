import React, {useState} from 'react';
import {TouchableWithoutFeedback, StyleSheet, View} from 'react-native';
import {Icon, IconElement, Input, Text} from '@ui-kitten/components';
import CountryFlag from 'react-native-country-flag';
import {phone} from 'phone';
import {useAppSelector} from '../../redux/store';
import {sessionSet, setPhone} from '../../redux/functionsDispatch';
import {trpcFunc} from '../../trpc';
import {useNavigation} from '@react-navigation/native';
import {type StackNavigation} from '../../types/typesNavigation';
import {connectMainSocket} from '../../sockets/ioMain';

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
  const [veritionCode, setVeritionCode] = useState('');
  const phoneNumber = useAppSelector(
    (state) => state.cleaning.order.review.phone,
  );

  const session = useAppSelector((state) => state.session.sessionToken);
  const smsSent = useAppSelector((state) => state.cleaning.order.smsSent);
  const navigation = useNavigation<StackNavigation>();
  const forwardTo = useAppSelector((state) => state.cleaning.modals.forwardTo);

  console.log('--forwardTo--', forwardTo);

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

  return smsSent ? (
    <Input
      value={veritionCode}
      label="Код верификации:"
      placeholder="Введите код"
      onChangeText={async (nextValue) => {
        setVeritionCode(nextValue);
        if (nextValue.length === 6) {
          const data = await trpcFunc.extUserSignupSMSverify.mutate({
            phoneNumber,
            verificationCode: nextValue,
          });
          if ('session' in data) {
            sessionSet({sessionToken: data.session});
            connectMainSocket();
            if (forwardTo) navigation.navigate('Order');
          }
        }
      }}
    />
  ) : (
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
    // fontFamily: 'opensans-regular',
    color: '#8F9BB3',
  },
});

export {PhoneNumberInput};
