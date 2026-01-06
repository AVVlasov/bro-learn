import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { router } from 'expo-router';
import { Course } from '@/services/courseService';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    router.push(`/course/${course.id}`);
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return difficulty;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="displaySmall" style={styles.icon}>
            {course.icon}
          </Text>
          <Text variant="titleLarge" style={[styles.title, { color: colors.text }]}>
            {course.title}
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: colors.textSecondary }]}>
            {course.description}
          </Text>

          <Text variant="bodySmall" style={[styles.meta, { color: colors.textSecondary }]}>
            {getDifficultyText(course.difficulty)} • {course.totalLessons} уроков • ~
            {course.estimatedHours}ч
          </Text>

          <ProgressBar
            progress={course.progressPercentage / 100}
            color={course.color}
            style={styles.progressBar}
          />
          <Text variant="bodySmall" style={[styles.progressText, { color: colors.textSecondary }]}>
            {course.completedLessons} из {course.totalLessons} уроков пройдено (
            {course.progressPercentage}%)
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
  },
  meta: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
  },
});
