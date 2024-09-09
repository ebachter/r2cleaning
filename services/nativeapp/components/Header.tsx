import React from 'react';
import {Appbar} from 'react-native-paper';
// import {getHeaderTitle} from '@react-navigation/elements';
import {useNavigation, useRoute} from '@react-navigation/native';
import {logout} from '../redux/functionsDispatch';
import {View} from 'react-native';
import {
  Button,
  Icon,
  IconElement,
  MenuItem,
  OverflowMenu,
} from '@ui-kitten/components';
import {allRoutes} from '../routes';

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
  const navigation = useNavigation();

  const title = allRoutes[route.name].title;

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
              : () => navigation.navigate('HomeInt')
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
          <MenuItem
            title="Supplier"
            onPress={() => {
              navigation.navigate('Supplier');
            }}
          />
          <MenuItem title="Настройки" />
          <MenuItem
            accessoryLeft={LogoutIcon}
            title="Выход"
            onPress={() => {
              logout();
            }}
          />
        </OverflowMenu>
      </View>
    </Appbar.Header>
  );
}
