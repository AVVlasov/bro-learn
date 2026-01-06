import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface XPBarProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  progressPercentage: number;
}

export const XPBar: React.FC<XPBarProps> = ({ level, currentXP, xpToNextLevel, progressPercentage }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.levelBadge, { backgroundColor: colors.levelBadge }]}>
          <Text variant="titleMedium" style={styles.levelText}>
            {level}
          </Text>
        </View>
        <View style={styles.xpInfo}>
          <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
            {xpToNextLevel} XP до следующего уровня
          </Text>
        </View>
      </View>
      <ProgressBar
        progress={progressPercentage / 100}
        color={colors.xpBar}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  xpInfo: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});
