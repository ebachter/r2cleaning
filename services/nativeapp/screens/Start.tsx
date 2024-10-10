import {StyleSheet, Text, View} from 'react-native';
import {ImageBackground} from 'react-native';
import * as React from 'react';
import {Button as Button2} from 'react-native-paper';
import {navigate} from '../RootNavigation';
import {useTranslation} from 'react-i18next';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const {t} = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'column',
      }}
    >
      <View
        style={{
          width: '100%',
        }}
      >
        <ImageBackground
          source={require('../assets/cl_start_bg.webp')}
          resizeMode="cover"
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            // opacity: 0.5,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <View
            style={{
              height: '100%',
              width: '100%',
              // opacity: 0.6,
              backgroundColor: 'rgba(0,0,0,.4)',
              flex: 1,
              paddingTop: 40,
              paddingBottom: 40,
              alignItems: 'center',
            }}
          >
            <ImageBackground
              source={require('../assets/cl_logo_2_white.png')}
              style={{
                width: 100,
                height: 40,
                maxWidth: '100%',
                marginBottom: 10,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                borderBottomColor: 'orange',
                borderBottomWidth: 3,
                width: 60,
              }}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 38,
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
                textAlign: 'center',
              }}
              numberOfLines={2}
            >
              {t('start:header1ProfCleaning')}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 10}}>
              {`- ${t('start:header2Quality')}`}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 10}}>
              {`- ${t('start:header3Pricing')}`}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 10}}>
              {`- ${t('start:header4Objects')}`}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 30}}>
              {`- ${t('start:header5specialists')}`}
            </Text>

            <View style={{marginBottom: 30, alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Button2
                    mode="contained"
                    style={styles.button}
                    onPress={() => {
                      navigate({Login: {}});
                    }}
                  >
                    {t('start:buttonLogin')}
                  </Button2>
                </View>
                <Button2
                  mode="contained"
                  style={styles.button}
                  onPress={() => {
                    navigate({Signup: {}});
                  }}
                >
                  {t('start:buttonSignup')}
                </Button2>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View
        style={{
          flex: 1,
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        <View style={{flexDirection: 'row'}}>
          <Button2
            mode="text"
            onPress={() => {
              i18n.changeLanguage('en');
              AsyncStorage.setItem('language', 'en');
            }}
          >
            English
          </Button2>
          <Button2
            mode="text"
            onPress={() => {
              i18n.changeLanguage('de');
              AsyncStorage.setItem('language', 'de');
            }}
          >
            Deutsch
          </Button2>
          <Button2
            mode="text"
            onPress={() => {
              i18n.changeLanguage('ru');
              AsyncStorage.setItem('language', 'ru');
            }}
          >
            Русский
          </Button2>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // textAlign: 'center',
    border: '2px solid green',
    maxWidth: 500,
  }, */

  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    opacity: 0.9,
  },

  button: {
    margin: 2,
    width: 140,
  },
});
