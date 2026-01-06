import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { router, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { XPBar } from '@/components/gamification/XPBar';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const rootNavigationState = useRootNavigationState();
  
  const { user, isAuthenticated, isLoading: authLoading, loadUser } = useAuthStore();
  const { userProgress, loadUserProgress, isLoading: progressLoading } = useProgressStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Проверяем готовность навигатора
  const navigationReady = rootNavigationState?.key != null;

  useEffect(() => {
    const init = async () => {
      await loadUser();
    };
    init();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !progressLoading) {
      loadUserProgress();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Редирект только когда навигатор готов и загрузка завершена
    if (navigationReady && !isAuthenticated && !authLoading) {
      router.replace('/auth/login');
    }
  }, [navigationReady, isAuthenticated, authLoading]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserProgress();
    setRefreshing(false);
  };

  if (authLoading || progressLoading || !user || !userProgress) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.greeting, { color: colors.text }]}>
          Привет, {user.name}! 👋
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
          Продолжай обучение и достигай новых высот
        </Text>
      </View>

      <XPBar
        level={userProgress.user.level}
        currentXP={userProgress.user.xp}
        xpToNextLevel={userProgress.stats.xpToNextLevel}
        progressPercentage={userProgress.stats.currentLevelProgress}
      />

      <StreakCounter streak={userProgress.user.streak} />

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="displaySmall" style={[styles.statNumber, { color: colors.primary }]}>
              {userProgress.stats.totalLessonsCompleted}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
              Уроков пройдено
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="displaySmall" style={[styles.statNumber, { color: colors.success }]}>
              {userProgress.user.xp}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
              Всего XP
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actionContainer}>
        <Button
          mode="contained"
          onPress={() => router.push('/(tabs)/learn')}
          style={styles.actionButton}
          icon="book-open-variant">
          Продолжить обучение
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push('/(tabs)/practice')}
          style={styles.actionButton}
          icon="star">
          Практика
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
    padding: 16,
    paddingTop: 24,
  },
  greeting: {
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
  },
});
