import {StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {useAppSelector} from '../redux/store';
import {mergeLocal} from '../redux/functionsDispatch';

const SnackbarComp = () => {
  const snackbarVisible = useAppSelector(
    (state) => state.local.snackbarVisible,
  );

  // const [visible, setVisible] = React.useState(false);
  // const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () =>
    mergeLocal({snackbarVisible: {value: false, text: ''}});

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
