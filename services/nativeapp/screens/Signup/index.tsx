import {View} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useImmer} from 'use-immer';
import {signupInitData, SignupState} from './localShared';
import {MainCard} from './SignupData';
import {ConfirmCode} from './ConfirmCode';

export default function ScreenSignup() {
  const [state, setState] = useImmer<SignupState>(signupInitData);

  return (
    <View style={{margin: 10}}>
      <View
        style={[
          {
            alignSelf: 'center',
            width: 'auto',
            marginTop: 50,
          },
        ]}
      >
        <Avatar.Image size={80} source={{uri: '/assets/cleaning_icon.png'}} />
      </View>

      {state.showView === 'success' && (
        <ConfirmCode state={state} setState={setState} />
      )}

      {state.showView === 'userdata' && (
        <MainCard state={state} setState={setState} />
      )}
    </View>
  );
}
