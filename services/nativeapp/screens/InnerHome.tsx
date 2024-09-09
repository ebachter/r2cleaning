import * as React from 'react';
import {View, Text} from 'react-native';
import {Button} from '@ui-kitten/components';
// import SnackbarComp from '../components/Snackbar';
import {mergeLocal, showSnackbar} from '../redux/functionsDispatch';
import {useNavigation} from '@react-navigation/native';
// import Header from '../components/Header';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';

export default function DetailsScreen({}) {
  // const {message} = useAppSelector((state) => state.message);
  const navigation = useNavigation();

  return (
    <>
      {/* <View>
        <Header />
      </View> */}

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'aliceblue',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Text>Home screen</Text>

        <Button
          style={{
            marginTop: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('Requests')}
        >
          Заявки
        </Button>

        <Button
          style={{
            marginTop: 10,
            marginBottom: 5,
            width: '100%',
          }}
          appearance="outline"
          onPress={() => navigation.navigate('Objects')}
        >
          Объекты
        </Button>

        {/* <Button
          style={{
            marginTop: 10,
            marginBottom: 40,
            width: '100%',
          }}
          appearance="outline"
        >
          История заявок
        </Button> */}
        <View style={{marginTop: 5, marginBottom: 5}} />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => mergeLocal({modals: {addOrder: true}})}
          label="New request"
          size="small"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
