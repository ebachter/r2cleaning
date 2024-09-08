/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {Ionicons} from '@expo/vector-icons';
import {ObjectTypeRadio} from './Step1ObjectTypes';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
// import ObjectDetails from './ObjectDetails';
import OrderSummary from './Step3Review';
import {useAppSelector} from '../../redux/store';
import {trpcComp} from '../../trpc';
import {
  mergeOrder,
  setOrderFormInit,
  showSnackbar,
} from '../../redux/functionsDispatch';
import {StackNavigation} from '../../routes';
import Step2 from './Step2Details';

const indicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#7eaec4',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#7eaec4',
  stepStrokeUnFinishedColor: '#dedede',
  separatorFinishedColor: '#7eaec4',
  separatorUnFinishedColor: '#dedede',
  stepIndicatorFinishedColor: '#7eaec4',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#7eaec4',
};

const steps = [
  {
    label: 'Select object',
    content: () => <>OType</>,
  },
  {
    label: 'Order details',
    content: () => <>OType</>,
  },
  {
    label: 'Ревью и заказ',
    content: () => <>OType</>,
  },
];

export default function OrderStepper() {
  const {
    type: object_type,
    id: object_id,
    addressCity: address_city,
    area,
  } = useAppSelector((state) => state.request.object);
  const price = useAppSelector((state) => state.request.price);
  /* const phoneNumber = useAppSelector(
    (state) => state.request.order.review.phone,
  ); */
  const navigation = useNavigation<StackNavigation>();
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const onStepPress = (position: number) => {
    setCurrentPage(position);
  };
  const {
    service: {type: serviceType},
    orderCreated,
    date,
  } = useAppSelector((state) => state.request);

  {
    /* <MaterialIcons {...getStepIndicatorIconConfig(params)} /> */
  }
  const renderStepIndicator = (params: any) => {
    // console.log('params', params);
    return params.stepStatus === 'finished' ? (
      <Ionicons
        name="checkmark-circle"
        size={18}
        color="hsla(202, 51%, 34%, 1)"
      />
    ) : (
      <Text style={{color: '#4a7895'}}>{params.position + 1}</Text>
    );
  };

  const renderLabel = ({
    position,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </Text>
    );
  };

  const order = trpcComp.createOrder.useMutation({
    onSuccess(data, variables, context) {
      mergeOrder({orderCreated: true});
      showSnackbar({text: `Order ${data.newOrderId} created`});
      setOrderFormInit();
      navigation.navigate('Orders');
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          customStyles={indicatorStyles}
          currentPosition={currentPage}
          labels={steps.map((l) => l.label)}
          renderLabel={renderLabel}
          renderStepIndicator={renderStepIndicator}
          onPress={onStepPress}
          stepCount={3}
        />
      </View>

      <View style={styles.page}>
        <View>
          {currentPage === 0 ? (
            <ObjectTypeRadio />
          ) : currentPage === 1 ? (
            <Step2 />
          ) : currentPage === 2 ? (
            <OrderSummary />
          ) : null}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <View>
          <Button
            // mode="outlined"
            onPress={() => navigation.navigate('HomeInt')}
            style={{width: 90, borderRadius: 5, marginLeft: 10}}
            compact={true}
            labelStyle={{marginTop: 2, marginBottom: 2}}
          >
            Отмена
          </Button>
        </View>

        {currentPage > 0 && (
          <View>
            <Button
              mode="contained"
              onPress={() => {
                console.log('Continue', currentPage);
                // if (currentPage < 2)
                setCurrentPage(currentPage - 1);
              }}
              style={{flex: 1, borderRadius: 5, marginRight: 10}}
              compact={true}
              labelStyle={{marginTop: 2, marginBottom: 2}}
            >
              Назад
            </Button>
          </View>
        )}
        {currentPage < 2 && (
          <View>
            <Button
              mode="contained"
              onPress={() => {
                // console.log('Continue', currentPage);
                // if (currentPage < 2)
                setCurrentPage(currentPage + 1);
              }}
              style={{flex: 1, borderRadius: 5, marginRight: 10}}
              compact={true}
              labelStyle={{marginTop: 2, marginBottom: 2}}
              disabled={currentPage === 0 && !object_id}
            >
              Продолжить
            </Button>
          </View>
        )}

        {currentPage === 2 && !orderCreated && (
          <View>
            <Button
              mode="contained"
              onPress={() => {
                order.mutate({
                  object_id,
                  // price: String(price),
                  serviceTypeId: serviceType,
                  date,
                });
              }}
              style={{flex: 1, borderRadius: 5, marginRight: 10}}
              compact={true}
              labelStyle={{marginTop: 2, marginBottom: 2}}
            >
              Заказать
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginVertical: 50,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
});
