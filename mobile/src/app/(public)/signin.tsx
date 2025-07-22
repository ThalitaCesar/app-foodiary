import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import z from 'zod';
import { AuthLayout } from '../../components/AuthLayout';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';

// Aqui foi usado o react-hook-form para gerenciar o estado do formulário
// e o zod para validação dos campos de entrada

const schema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(8, 'Deve conter pelo menos 8 caracteres'),
});

export default function SignIn() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { signIn } = useAuth();

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      await signIn(formData);
    } catch (error) {
      console.log(error);
      Alert.alert('Credenciais inválidas!');
    }
  });

  return (
    <AuthLayout
      icon="👤"
      title="Entre em sua conta"
      subtitle="Acesse sua conta para continuar"
    >
      <View className="justify-between flex-1">
        <View className="gap-6">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                label="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                label="Senha"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>

        <View className="flex-row gap-6">
          <Button onPress={router.back} size="icon" color="gray">
            <ArrowLeftIcon size={20} color={colors.black[700]} />
          </Button>
          <Button
            className="flex-1"
            onPress={handleSubmit}
            loading={form.formState.isSubmitting}
          >
            Entrar
          </Button>
        </View>
      </View>
    </AuthLayout>
  );
}