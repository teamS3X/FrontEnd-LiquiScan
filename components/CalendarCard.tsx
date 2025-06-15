import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  day: number;
  selected: boolean;
  hasData: boolean;
  dimmed?: boolean;
  isToday?: boolean;
  onPress: () => void;
};


export function CalendarCard({ day, selected, hasData, dimmed = false, isToday = false, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selected,
        hasData && styles.hasData,
        isToday && styles.today,
      ]}
      onPress={onPress}
      disabled={dimmed}
    >
      <Text
        style={[
          styles.dayText,
          selected && styles.dayTextSelected,
          dimmed && styles.dimmedText,
        ]}
      >
        {day}
      </Text>
      {hasData && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.text,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  selected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  hasData: {
    borderColor: Colors.dark.primary,
  },
  dayText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  today: {
  borderColor: Colors.dark.primary,
  borderWidth: 2,
  },

  dayTextSelected: {
    color: Colors.dark.background,
  },
  dimmedText: {
    opacity: 0.3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.primary,
    position: 'absolute',
    bottom: 6,
  },
});
