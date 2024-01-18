// import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {ImageBackground} from 'react-native';
import * as React from 'react';
import {Button as Button2} from 'react-native-paper';
import {Button, Layout} from '@ui-kitten/components';
import {setModals} from '../redux/functionsDispatch';
import {useAppSelector} from '../redux/store';

export default function HomeScreen({navigation}) {
  // const apiOrigin = process.env.EXPO_PUBLIC_API_ORIGIN;
  const sessionToken = useAppSelector((state) => state.session.sessionToken);
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
              {'Профессиональный клининг'}
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
              onPress={() =>
                sessionToken
                  ? navigation.navigate('Order')
                  : setModals({login: true, forwardTo: 'Order'})
              }
              style={{minWidth: 150}}
            >
              Заказ
            </Button2>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.container2}>
        <Layout style={styles.container3} level="1">
          <Button
            style={styles.button}
            onPress={() => setModals({login: true})}
          >
            Войти
          </Button>
          <Button
            appearance="outline"
            style={styles.button}
            onPress={() => setModals({signup: true})}
          >
            Создать
          </Button>
          {/*  onPress={() => navigation.navigate('Details')} */}
        </Layout>
      </View>

      <View style={styles.container2}>
        <View style={[styles.box, {backgroundColor: 'powderblue'}]} />
        <View style={[styles.box, {backgroundColor: 'skyblue'}]} />
        <View
          style={[
            styles.box,
            {
              backgroundColor: 'steelblue',
              width: 'auto',
              minWidth: 50,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // textAlign: 'center',
    border: '2px solid green',
    maxWidth: 500,
  },

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

  box: {
    width: 50,
    height: 50,
  },

  container2: {
    marginTop: 8,
    backgroundColor: 'aliceblue',
    // minHeight: 200,
    alignItems: 'center',
  },

  button: {
    margin: 2,
    width: 100,
  },
});
