import {StyleSheet, Text, View} from 'react-native';
import {ImageBackground} from 'react-native';
import * as React from 'react';
import {Button as Button2} from 'react-native-paper';
import {Button, Layout} from '@ui-kitten/components';
import {mergeLocal, mergeSession} from '../redux/functionsDispatch';
import {navigate} from '../RootNavigation';
import {useTranslation} from 'react-i18next';
import {Link} from '@react-navigation/native';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const {t} = useTranslation();
  return (
    <View
      style={{
        // flex: 1,
        flexDirection: 'column',
      }}
    >
      <View
        style={{
          width: '100%',
          minHeight: 500,
          // height: 'auto',
        }}
      >
        <ImageBackground
          source={require('../assets/cl_start_bg.webp')}
          // style={{width: '100%', height: 'auto'}}
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
              backgroundColor: 'rgba(0,0,0,.5)',
              flex: 1,
              paddingTop: 40,
              paddingBottom: 40,
              // minHeight: 200,
              alignItems: 'center',
            }}
          >
            <ImageBackground
              source={require('../assets/cl_logo_2_white.png')}
              style={{
                // width: 30, height: 40,
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
            {/* <Text>Профессиональный клининг</Text> */}
            <Text
              style={{
                color: 'white',
                fontSize: 38,
                lineHeight: 84,
                fontWeight: 'bold',
                marginBottom: 10,
                textAlign: 'center',
              }}
              numberOfLines={2}
            >
              {t('landingPage:headerProfCleaning')}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 10}}>
              {'- гарантия качества'}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 10}}>
              {'- фиксированная цена'}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 10}}>
              {'- частные и коммерческие объекты'}
            </Text>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 30}}>
              {'- подготовленные специалисты'}
            </Text>

            <Button2
              icon="file-sign"
              mode="contained"
              onPress={() => mergeLocal({modals: {login: {open: true}}})}
              style={{minWidth: 150}}
            >
              Заявка
            </Button2>
          </View>
        </ImageBackground>
      </View>

      <View style={{marginTop: 8, alignItems: 'center'}}>
        <Layout style={styles.container3} level="1">
          <Button
            style={styles.button}
            onPress={() => {
              // mergeLocal({modals: {login: {open: true}}});
              navigate({Login: {}});
            }}
          >
            Логин
          </Button>
          <Button
            appearance="outline"
            style={styles.button}
            onPress={() => {
              // mergeLocal({modals: {signup: true}})
              navigate({Signup: {}});
            }}
          >
            Регистрация
          </Button>
          {/*  onPress={() => navigation.navigate('HomeInt')} */}
        </Layout>
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 60,
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

  container3: {
    flexDirection: 'row',
    alignItems: 'center',
  },

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
    width: 100,
  },
});
