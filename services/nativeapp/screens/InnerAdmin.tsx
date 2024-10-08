import {View} from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  List,
  MD3Colors,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import {useImmer} from 'use-immer';
import {trpcComp} from '../trpc';
import {showSnackbar} from '../redux/functionsDispatch';

const initData = {
  newCity: '',
  showAddCity: false,
  showDeleteCity: 0,
  newCityName: {nameEn: '', nameDe: '', nameRu: ''},
} as const;

export default function ScreenAdmin() {
  const [state, setState] = useImmer<{
    newCity: string;
    showAddCity: boolean;
    showDeleteCity: number;
    newCityName: {nameEn: string; nameDe: string; nameRu: string};
  }>(initData);

  const {data, refetch} = trpcComp.admin.loadCities.useQuery(undefined, {
    initialData: [],
  });
  const addLocation = trpcComp.admin.addLocation.useMutation();
  const deleteLocation = trpcComp.admin.deleteLocation.useMutation();

  return (
    <>
      <View style={{margin: 10}}>
        <List.Section>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Text variant="headlineSmall">Cities</Text>
            </View>

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <IconButton
                mode="contained"
                icon="plus"
                iconColor={MD3Colors.error50}
                size={20}
                onPress={() =>
                  setState((d) => {
                    d.showAddCity = true;
                  })
                }
              />
            </View>
          </View>

          {data.map((o, i) => (
            <List.Item
              key={i}
              title={`${o.id}. ${o.nameEn}-${o.nameDe}-${o.nameRu}`}
              left={() => (
                <List.Icon color={MD3Colors.tertiary70} icon="city" />
              )}
              right={() => (
                <IconButton
                  // mode="contained"
                  icon="delete"
                  // iconColor={MD3Colors.error50}
                  size={20}
                  onPress={async () => {
                    setState((d) => {
                      d.showDeleteCity = o.id;
                    });
                  }}
                />
              )}
            />
          ))}
        </List.Section>
      </View>

      <Portal>
        <Dialog
          visible={state.showAddCity}
          onDismiss={() =>
            setState((d) => {
              d.showAddCity = false;
            })
          }
        >
          <Dialog.Title>Add city</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Different languages</Text>
            <TextInput
              mode="outlined"
              label="English"
              value={state.newCityName.nameEn}
              onChangeText={(text) =>
                setState((d) => {
                  d.newCityName.nameEn = text;
                })
              }
            />
            <TextInput
              mode="outlined"
              label="German"
              value={state.newCityName.nameDe}
              onChangeText={(text) =>
                setState((d) => {
                  d.newCityName.nameDe = text;
                })
              }
            />
            <TextInput
              mode="outlined"
              label="Russian"
              value={state.newCityName.nameRu}
              onChangeText={(text) =>
                setState((d) => {
                  d.newCityName.nameRu = text;
                })
              }
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={async () => {
                if (
                  state.newCityName.nameEn.length < 2 ||
                  state.newCityName.nameDe.length < 2 ||
                  state.newCityName.nameRu.length < 2
                ) {
                  showSnackbar({text: 'Names cannot be empty'});
                  return;
                }
                try {
                  await addLocation.mutateAsync(state.newCityName);
                  refetch();
                  setState(() => initData);
                  showSnackbar({text: 'Successfully added'});
                } catch (e) {
                  showSnackbar({text: 'There was an error'});
                }
              }}
            >
              Add
            </Button>
            <Button onPress={() => setState(() => initData)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={state.showDeleteCity > 0}
          onDismiss={() =>
            setState((d) => {
              d.showDeleteCity = 0;
            })
          }
        >
          <Dialog.Title>Delete city</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Do you want to delete the city?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={async () => {
                await deleteLocation.mutateAsync({
                  cityId: state.showDeleteCity,
                });
                refetch();
                setState((d) => {
                  d.showDeleteCity = 0;
                });
              }}
            >
              Delete
            </Button>
            <Button onPress={() => setState(() => initData)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
