import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {FormControl, FormLabel, TextField} from '@mui/material';
// import OrderAppartmentSex from './OrderSex';
import OrderObjectType from './ObjectTypeSelect';
import OrderAppartment from './appartment';
import OrderEntrance from './OrderEntrance';
import OrderHouse from './OrderHouse';
import {useAppSelector} from '../../../hooks/hooksRedux';

export default function VerticalLinearStepper() {
  const objectType = useAppSelector((state) => state.cleaning.objectType);

  const steps = [
    {
      label: 'Тип объекта',
      content: () => <OrderObjectType />,
    },
    {
      label: 'Детали объекта',
      content:
        objectType === 'appartment'
          ? OrderAppartment
          : objectType === 'house'
          ? () => <OrderHouse />
          : objectType === 'entrance'
          ? () => <OrderEntrance />
          : () => <OrderHouse />,
    },
    {
      label: 'Ревью и заказ',
      content: () => (
        <>
          <FormControl sx={{mt: 5, ml: 1}}>
            <FormLabel>Сумма:</FormLabel>
            <FormLabel>5000 руб.</FormLabel>
          </FormControl>
        </>
      ),
    },
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{maxWidth: 400}}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent TransitionProps={{unmountOnExit: false}}>
              {/* <Typography>{step.description}</Typography> */}
              {/* {index === 0 && activeStep !== 0 && (
                <div>{objectTypes.find((o) => (o.id = objectType))?.label}</div>
              )} */}
              {React.createElement(step.content, {objectType})}
              <Box sx={{mb: 2}}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{mt: 2, mr: 1}}
                  >
                    {index === steps.length - 1 ? 'Заказать' : 'Продолжить'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{mt: 1, mr: 1}}
                  >
                    Назад
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{p: 3}}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{mt: 1, mr: 1}}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
