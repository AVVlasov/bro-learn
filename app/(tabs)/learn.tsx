import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Searchbar } from 'react-native-paper';
import { courseService, Course } from '@/services/courseService';
import { CourseCard } from '@/components/course/CourseCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCourses = async () => {
    try {
      console.log('[LEARN] Загрузка курсов...');
      const data = await courseService.getAllCourses();
      console.log('[LEARN] Получено курсов:', data?.length || 0);
      console.log('[LEARN] Данные курсов:', JSON.stringify(data).substring(0, 200));
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('[LEARN] Ошибка загрузки курсов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: colors.text }]}>
          Курсы обучения
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
          Выберите курс для изучения
        </Text>
      </View>

      <Searchbar
        placeholder="Поиск курсов..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {filteredCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
              {searchQuery ? 'Курсы не найдены' : 'Нет доступных курсов'}
            </Text>
          </View>
        ) : (
          filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
        )}
      </ScrollView>
    </View>
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
  title: {
    marginBottom: 8,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
});
