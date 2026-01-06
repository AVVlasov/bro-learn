import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Divider, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { user, logout } = useAuthStore();
  const { userProgress, loadUserProgress, isLoading } = useProgressStore();

  useEffect(() => {
    loadUserProgress();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  if (isLoading || !user || !userProgress) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user.name.charAt(0).toUpperCase()} />
        <Text variant="headlineMedium" style={[styles.name, { color: colors.text }]}>
          {user.name}
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
          {user.email}
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={[styles.cardTitle, { color: colors.text }]}>
            Статистика
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.statRow}>
            <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
              Уровень
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: colors.primary }]}>
              {userProgress.user.level}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
              Опыт (XP)
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: colors.success }]}>
              {userProgress.user.xp}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
              Серия дней
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: colors.streakFire }]}>
              🔥 {userProgress.user.streak}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
              Уроков пройдено
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: colors.info }]}>
              {userProgress.stats.totalLessonsCompleted}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          icon="logout"
          style={styles.logoutButton}>
          Выйти
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
  },
  name: {
    marginTop: 16,
    marginBottom: 4,
  },
  card: {
    margin: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontWeight: 'bold',
  },
  actions: {
    padding: 16,
  },
  logoutButton: {
    marginBottom: 16,
  },
});
