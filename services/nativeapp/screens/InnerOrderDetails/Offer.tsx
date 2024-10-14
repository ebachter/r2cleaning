import {StyleSheet, View, ViewProps} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';
import {trpc} from '../../trpc';
import {showSnackbar} from '../../redux/functionsDispatch';
import {RouterOutputs} from '@remrob/api';
import {
  Dialog,
  Portal,
  Text as TextPaper,
  Button as ButtonPaper,
} from 'react-native-paper';
import {useState} from 'react';

export const OfferCard = ({
  orderExists,
  data,
  refetch,
}: {
  orderExists: boolean;
  data: RouterOutputs['user']['order']['get']['one']['offers'][number];
  refetch: () => void;
}): React.ReactElement => {
  const order = trpc.user.order.accept.useMutation();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Card
        style={styles.card}
        header={
          <View>
            <Text category="h6">Offer</Text>
            <Text category="s1">
              by {`${data.user.firstName} ${data.user.lastName}`}
            </Text>
          </View>
        }
        footer={
          orderExists
            ? null
            : (props: ViewProps) => (
                <View style={[props.style, styles.footerContainer]}>
                  {/* <Button
                    style={styles.footerControl}
                    size="small"
                    status="basic"
                  >
                    REJECT
                  </Button> */}

                  <Button
                    style={styles.footerControl}
                    size="small"
                    onPress={async () => {
                      setVisible(true);
                    }}
                  >
                    ACCEPT
                  </Button>
                </View>
              )
        }
      >
        <Text>Time: {data.offer.cleaningTime.substring(0, 5)}</Text>
        <Text>Price: {data.offer.price}</Text>
        <Text>Status: {data.order ? 'Accecpted' : 'Open'}</Text>
      </Card>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <TextPaper variant="bodyLarge">
              I accept the contract bindingly.
            </TextPaper>
          </Dialog.Content>
          <Dialog.Actions>
            <ButtonPaper onPress={() => setVisible(false)}>Cancel</ButtonPaper>
            <ButtonPaper
              mode="contained"
              style={{width: 100}}
              onPress={async () => {
                await order.mutateAsync({offerId: data.offer.id});
                showSnackbar({text: `Order accepted`});
                refetch();
                setVisible(false);
              }}
            >
              Accept
            </ButtonPaper>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 2,
    maxHeight: 230,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
    alignItems: 'center',
    alignSelf: 'center',
  },
});
