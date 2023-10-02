import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {FormControl, FormLabel} from '@mui/material';
import OrderAppartmentSex from './OrderSex';
import OrderObjectType from './OrderObjectType';
import {ObjectTypes} from '../../../types/typesCleaning';
import OrderAppartment from './appartment/OrderAppartment';
import OrderEntrance from './OrderEntrance';
import OrderHouse from './OrderHouse';

export default function VerticalLinearStepper() {
  const [objectType, setObjectType] = React.useState<ObjectTypes>('appartment');

  const steps = [
    {
      label: 'Тип объекта',
      content: () => (
        <>
          <FormControl sx={{mt: 5, ml: 1}}>
            <FormLabel>Локация объекта</FormLabel>
          </FormControl>
          <OrderAppartmentSex />
          <FormControl sx={{mt: 5, ml: 1}}>
            <FormLabel>Тип объекта</FormLabel>
            <OrderObjectType
              objectType={objectType}
              setObjectType={setObjectType}
            />
          </FormControl>
        </>
      ),
    },
    {
      label: 'Детали объекта',
      content:
        objectType === 'appartment'
          ? () => (
              <OrderAppartment
                objectType={objectType}
                setObjectType={setObjectType}
              />
            )
          : objectType === 'entrance'
          ? () => <OrderEntrance />
          : () => <OrderHouse />,
    },
    {
      label: 'Create an ad',
      content: () => (
        <>
          <FormControl sx={{mt: 5, ml: 1}}>
            <FormLabel>Стоимость</FormLabel>
            <FormLabel>5000 руб.</FormLabel>
          </FormControl>
        </>
      ),
    },
  ];
  console.log('############');

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
            <StepContent>
              {/* <Typography>{step.description}</Typography> */}
              {React.createElement(step.content)}
              <Box sx={{mb: 2}}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{mt: 2, mr: 1}}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{mt: 1, mr: 1}}
                  >
                    Back
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
