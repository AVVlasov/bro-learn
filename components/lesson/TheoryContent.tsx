import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TheoryContentProps {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export const TheoryContent: React.FC<TheoryContentProps> = ({ content, imageUrl, videoUrl }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Card style={styles.card}>
      <Card.Content>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        )}
        
        <Text variant="bodyLarge" style={[styles.content, { color: colors.text }]}>
          {content}
        </Text>

        {videoUrl && (
          <Text variant="bodySmall" style={[styles.videoNote, { color: colors.textSecondary }]}>
            📹 Видео: {videoUrl}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  content: {
    lineHeight: 24,
  },
  videoNote: {
    marginTop: 16,
    fontStyle: 'italic',
  },
});
