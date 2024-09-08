import React from 'react';
import {View} from 'react-native';
import {TimePickerModal} from 'react-native-paper-dates';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {mergeOffer} from '../../../redux/functionsDispatch';

export default function SupplierTimePicker({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (arg: boolean) => void;
}) {
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = React.useCallback(
    ({hours, minutes}: {hours: number; minutes: number}) => {
      setVisible(false);
      console.log({hours, minutes});
      mergeOffer({time: {hours, minutes}});
    },
    [setVisible],
  );

  return (
    <SafeAreaProvider>
      <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12}
          minutes={14}
        />
      </View>
    </SafeAreaProvider>
  );
}
