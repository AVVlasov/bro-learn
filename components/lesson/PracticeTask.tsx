import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Checkbox, Button } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PracticeTaskProps {
  steps: string[];
  onComplete: () => void;
}

export const PracticeTask: React.FC<PracticeTaskProps> = ({ steps, onComplete }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(steps.length).fill(false));

  const toggleStep = (index: number) => {
    const newSteps = [...completedSteps];
    newSteps[index] = !newSteps[index];
    setCompletedSteps(newSteps);
  };

  const allCompleted = completedSteps.every((step) => step);

  const handleComplete = () => {
    if (allCompleted) {
      onComplete();
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={[styles.title, { color: colors.text }]}>
          Практическое задание
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.textSecondary }]}>
          Выполните следующие шаги:
        </Text>

        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <Checkbox.Item
              label={step}
              status={completedSteps[index] ? 'checked' : 'unchecked'}
              onPress={() => toggleStep(index)}
              style={styles.checkbox}
              labelStyle={[
                styles.stepLabel,
                completedSteps[index] && styles.completedLabel,
              ]}
            />
          </View>
        ))}

        <View style={styles.progressContainer}>
          <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
            Выполнено: {completedSteps.filter((s) => s).length} из {steps.length}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleComplete}
          disabled={!allCompleted}
          style={styles.button}>
          {allCompleted ? 'Завершить задание' : 'Выполните все шаги'}
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  stepContainer: {
    marginBottom: 8,
  },
  checkbox: {
    paddingLeft: 0,
  },
  stepLabel: {
    fontSize: 16,
  },
  completedLabel: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
