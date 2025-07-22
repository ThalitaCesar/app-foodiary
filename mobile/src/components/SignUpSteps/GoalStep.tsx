import { Controller, useFormContext } from 'react-hook-form';
import { OptionsSelector } from '../OptionsSelector';
import { SignUpFormData } from './signUpSchema';

export function GoalStep() {
  const form = useFormContext<SignUpFormData>();

  return (
    <Controller
      control={form.control}
      name="goal"
      render={({ field }) => (
        <OptionsSelector
          value={field.value}
          onChange={field.onChange}
          options={[
            {
              icon: '🥦',
              title: 'Perder peso',
              value: 'lose',
            },
            {
              icon: '🍍',
              title: 'Manter o peso',
              value: 'maintain',
            },
            {
              icon: '🥩',
              title: 'Ganhar peso',
              value: 'gain',
            },
          ]}
        />
      )}
    />
  );
}