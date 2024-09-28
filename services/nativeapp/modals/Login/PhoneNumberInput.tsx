import React, {useState} from 'react';
import {TouchableWithoutFeedback, StyleSheet, View} from 'react-native';
import {Icon, IconElement, Input, Text} from '@ui-kitten/components';
import CountryFlag from 'react-native-country-flag';
import {phone as phoneCheck} from 'phone';
import {useAppSelector} from '../../redux/store';
import {mergeLocal, mergeSession} from '../../redux/functionsDispatch';
import {trpcComp} from '../../trpc';
import {useNavigation} from '@react-navigation/native';
import {Session} from '../../types/typeSession';
import isEmail from 'validator/es/lib/isEmail';

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
  const {emailOrPhoneValue, loginType} = useAppSelector(
    (state) => state.local.modals.login,
  );

  const smsSent = useAppSelector((state) => state.session.smsSent);
  const navigation = useNavigation();
  const forwardTo = useAppSelector((state) => state.local.modals.forwardTo);

  const renderIcon = (): React.ReactElement => (
    <TouchableWithoutFeedback onPress={() => console.log('>>>')}>
      <View>
        {/* <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} /> */}
        {phoneCheck(emailOrPhoneValue).isValid ? (
          <CountryFlag
            isoCode={phoneCheck(emailOrPhoneValue).countryIso2}
            size={20}
          />
        ) : null}
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

  const extUserSignupSMSverify = trpcComp.extUserSignupSMSverify.useMutation({
    onSuccess(data, variables, context) {
      if ('session' in data) {
        mergeSession({
          sessionToken: data.session,
        });
        mergeLocal({
          modals: {
            login: {open: false},
            signup: false,
          },
        });
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
            phoneNumber: emailOrPhoneValue,
            verificationCode: nextValue,
            loginType,
          });
        }
      }}
    />
  ) : (
    <>
      <Input
        value={emailOrPhoneValue || ''}
        label="Номер телефона:"
        placeholder="Введите номер"
        caption={renderCaption}
        accessoryLeft={renderIcon}
        status={
          emailOrPhoneValue?.length < 5
            ? 'basic'
            : isPhoneValid
            ? 'success'
            : 'danger'
        }
        onChangeText={(nextValue) => {
          mergeLocal({
            modals: {login: {emailOrPhoneValue: nextValue.substring(0, 35)}},
            // .replace(/^[0-9+-]+$/g, '') ,
          });
          setPhoneValid(phoneCheck(nextValue).isValid);

          if (phoneCheck(nextValue).isValid) {
            mergeLocal({modals: {login: {loginType: 'phone'}}});
          } else if (isEmail(nextValue)) {
            mergeLocal({modals: {login: {loginType: 'email'}}});
          } else {
            mergeLocal({modals: {login: {loginType: null}}});
          }
        }}
      />
      <Text style={{marginTop: 10}}>
        {emailOrPhoneValue && phoneCheck(emailOrPhoneValue).isValid
          ? 'Valid phone number'
          : emailOrPhoneValue && isEmail(emailOrPhoneValue)
          ? 'Valid email'
          : ''}
      </Text>
    </>
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
