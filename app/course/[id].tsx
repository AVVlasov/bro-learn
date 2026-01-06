import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Card, Chip } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { courseService, CourseDetail } from '@/services/courseService';
import { ModuleList } from '@/components/course/ModuleList';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CourseDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams<{ id: string }>();

  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        if (id) {
          const data = await courseService.getCourseById(id);
          setCourseDetail(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки курса:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!courseDetail) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
          Курс не найден
        </Text>
      </View>
    );
  }

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

  const totalLessons = courseDetail.modules.reduce((sum, m) => sum + m.totalLessons, 0);
  const completedLessons = courseDetail.modules.reduce((sum, m) => sum + m.completedLessons, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="displayLarge" style={styles.icon}>
            {courseDetail.course.icon}
          </Text>
          <Text variant="headlineMedium" style={[styles.title, { color: colors.text }]}>
            {courseDetail.course.title}
          </Text>
          <Text variant="bodyLarge" style={[styles.description, { color: colors.textSecondary }]}>
            {courseDetail.course.description}
          </Text>

          <View style={styles.chips}>
            <Chip icon="signal" style={styles.chip}>
              {getDifficultyText(courseDetail.course.difficulty)}
            </Chip>
            <Chip icon="clock-outline" style={styles.chip}>
              ~{courseDetail.course.estimatedHours}ч
            </Chip>
            <Chip icon="book-open-variant" style={styles.chip}>
              {totalLessons} уроков
            </Chip>
          </View>

          <View style={styles.progressContainer}>
            <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
              Прогресс: {completedLessons} из {totalLessons} ({progressPercentage}%)
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.modulesContainer}>
        <Text variant="titleLarge" style={[styles.modulesTitle, { color: colors.text }]}>
          Модули курса
        </Text>
        <ModuleList modules={courseDetail.modules} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  modulesContainer: {
    padding: 16,
  },
  modulesTitle: {
    marginBottom: 16,
  },
});
