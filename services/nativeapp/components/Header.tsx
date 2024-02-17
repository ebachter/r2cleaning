import React from 'react';
import {Appbar} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import {ParamListBase, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {sessionSet} from '../redux/functionsDispatch';
import {View} from 'react-native';
import {
  Button,
  Icon,
  IconElement,
  MenuItem,
  OverflowMenu,
} from '@ui-kitten/components';
import {disconnectMainSocket} from '../sockets/ioMain';
import {useAppSelector} from '../redux/store';

const MenuIcon = (props): IconElement => (
  <Icon {...props} name="more-vertical" />
);

const LogoutIcon = (props): IconElement => <Icon {...props} name="log-out" />;

export default function CustomNavigationBar({
  showBack = true,
}: {
  showBack?: boolean;
}) {
  const route = useRoute();
  // console.log(route.name);

  const options = {
    title: 'Home',
    headerTitle: 'Home',
  };
  const options2 = {
    Order: {title: 'Заказ'},
    Orders: {title: 'Заказы'},
    Home: {title: 'Главная'},
    Details: {title: 'Главная'},
  };

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const forwardTo = useAppSelector((state) => state.cleaning.modals.forwardTo);

  const title = options2[route.name].title; // getHeaderTitle(options, route.name);

  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [visible, setVisible] = React.useState(false);

  const onItemSelect = (index): void => {
    setSelectedIndex(index);
    setVisible(false);
  };

  const renderToggleButton = (): React.ReactElement => (
    <Button
      onPress={() => setVisible(true)}
      appearance="ghost"
      accessoryLeft={MenuIcon}
    />
  );
  return (
    <Appbar.Header>
      {showBack && (
        <Appbar.BackAction
          onPress={
            navigation.canGoBack()
              ? navigation.goBack
              : () => navigation.navigate('Details')
          }
        />
      )}
      <Appbar.Content title={title} />
      <View>
        <OverflowMenu
          anchor={renderToggleButton}
          visible={visible}
          selectedIndex={selectedIndex}
          onSelect={onItemSelect}
          onBackdropPress={() => setVisible(false)}
        >
          <MenuItem title="Настройки" />
          <MenuItem title="Заказы" />
          <MenuItem
            accessoryLeft={LogoutIcon}
            title="Выход"
            onPress={() => {
              sessionSet({sessionToken: null});
              disconnectMainSocket();
              navigation.navigate('Home');
            }}
          />
        </OverflowMenu>
      </View>
    </Appbar.Header>
  );
}
