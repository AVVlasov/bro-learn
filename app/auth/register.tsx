import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setLocalError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      await register(name, email, password);
      router.replace('/(tabs)');
    } catch (err) {
      // Ошибка уже обработана в store
    }
  };

  const handleLogin = () => {
    router.back();
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="displaySmall" style={[styles.title, { color: colors.text }]}>
            Регистрация
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.textSecondary }]}>
            Создайте аккаунт для начала обучения
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Имя"
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              style={styles.input}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
            />

            <TextInput
              label="Пароль"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label="Подтвердите пароль"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading || !name || !email || !password || !confirmPassword}
              style={styles.button}>
              Зарегистрироваться
            </Button>

            <Button mode="text" onPress={handleLogin} style={styles.linkButton}>
              Уже есть аккаунт? Войти
            </Button>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={!!displayError}
        onDismiss={() => {
          setLocalError('');
          clearError();
        }}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => {
            setLocalError('');
            clearError();
          },
        }}>
        {displayError}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  linkButton: {
    marginTop: 8,
  },
});
