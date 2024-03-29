import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Snackbar} from 'react-native-paper';
import {useAppSelector} from '../redux/store';
import {showSnackbar} from '../redux/functionsDispatch';

const SnackbarComp = () => {
  const snackbarVisible = useAppSelector(
    (state) => state.cleaning.snackbarVisible,
  );

  // const [visible, setVisible] = React.useState(false);
  // const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => showSnackbar({value: false, text: ''});

  return (
    <>
      {/* <View style={styles.container}> */}
      {/* <Button onPress={onToggleSnackBar}>{visible ? 'Hide' : 'Show'}</Button> */}
      <Snackbar
        visible={snackbarVisible.value}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}
      >
        {snackbarVisible.text}
      </Snackbar>
      {/* </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default SnackbarComp;
