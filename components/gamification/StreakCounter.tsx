import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text variant="displayMedium" style={[styles.streakNumber, { color: colors.streakFire }]}>
          🔥 {streak}
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
          {streak === 0 ? 'Начните серию!' : `${streak} ${getDaysWord(streak)} подряд`}
        </Text>
      </Card.Content>
    </Card>
  );
};

const getDaysWord = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'дня';
  return 'дней';
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
  streakNumber: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
