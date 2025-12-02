"use client";

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { ReactNode, useState } from 'react';

export type FormStep = {
  label: string;
  description?: string;
  content: ReactNode;
};

export type FormStepperProps = {
  steps: FormStep[];
  onComplete?: () => void;
};

export function FormStepper({ steps, onComplete }: FormStepperProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete?.();
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mb: 4 }}>{steps[activeStep]?.content}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </Box>
      {steps[activeStep]?.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {steps[activeStep]?.description}
        </Typography>
      )}
    </Box>
  );
}
