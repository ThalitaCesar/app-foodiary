import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '../Input';
import { SignUpFormData } from './signUpSchema';
import { Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export function BirthDateStep() {
  const { control, setValue } = useFormContext<SignUpFormData>();
  const [showPicker, setShowPicker] = useState(false);

  function formatDate(date: Date) {
    return date.toLocaleDateString('pt-BR'); 
  }

  return (
    <Controller
      control={control}
      name="birthDate"
      render={({ field, fieldState }) => {
        const currentDate = field.value
          ? new Date(field.value.split('/').reverse().join('-'))
          : new Date();

        return (
          <>
            <Pressable onPress={() => setShowPicker(true)}>
              <Input
                label="Data de nascimento"
                placeholder="DD/MM/AAAA"
                value={field.value}
                editable={false} 
                pointerEvents="none"
                error={fieldState.error?.message}
              />
            </Pressable>

            {showPicker && (
              <DateTimePicker
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={currentDate}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) {
                    const formatted = formatDate(selectedDate);
                    setValue('birthDate', formatted, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            )}
          </>
        );
      }}
    />
  );
}
