import React, {useState} from 'react';
import {TouchableWithoutFeedback, StyleSheet, View} from 'react-native';
import {Icon, IconElement, Input, Text} from '@ui-kitten/components';
import CountryFlag from 'react-native-country-flag';
import {phone} from 'phone';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {mergeLocal, mergeSession} from '../../redux/functionsDispatch';
import {trpcComp, trpcFunc} from '../../trpc';
import {useNavigation} from '@react-navigation/native';
import {type StackNavigation} from '../../types/typesNavigation';
import {connectMainSocket} from '../../sockets/ioMain';
import {sessionActions} from '../../redux/sliceSession';
import {Session} from '../../types/typeSession';

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
  const phoneNumber = useAppSelector((state) => state.session.phone);

  const smsSent = useAppSelector((state) => state.session.smsSent);
  const navigation = useNavigation<StackNavigation>();
  const forwardTo = useAppSelector((state) => state.local.modals.forwardTo);

  const renderIcon = (): React.ReactElement => (
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

  const dispatch = useAppDispatch();

  const extUserSignupSMSverify = trpcComp.extUserSignupSMSverify.useMutation({
    onSuccess(data, variables, context) {
      if ('session' in data) {
        mergeSession({
          sessionToken: data.session,
        });
        mergeLocal({
          modals: {
            login: false,
            signup: false,
          },
        });
        // connectMainSocket();
        if (forwardTo) navigation.navigate(forwardTo);
        else navigation.navigate('HomeInt');
      }
    },
  });

  return smsSent ? (
    <Input
      value={veritionCode}
      label="Код верификации:"
      placeholder="Введите код"
      onChangeText={(nextValue) => {
        setVeritionCode(nextValue);
        if (nextValue.length === 6) {
          extUserSignupSMSverify.mutate({
            phoneNumber,
            verificationCode: nextValue,
          });
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
        if (/^\+[\d]*$/.test(nextValue)) {
          dispatch(sessionActions.setPhone(nextValue as Session['phone']));
          // setPhone(nextValue);
        }
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
