import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  title,
  description,
  unlocked,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Card style={[styles.card, { opacity: unlocked ? 1 : 0.5 }]}>
      <Card.Content style={styles.content}>
        <Text variant="displaySmall" style={styles.icon}>
          {icon}
        </Text>
        <Text variant="titleMedium" style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
          {description}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    margin: 8,
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
});
