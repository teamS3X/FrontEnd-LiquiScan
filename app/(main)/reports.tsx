import { AlcoholUsage, DailyReportSummary } from '@/components/DailyReportSummary';
import { ReportCalendar } from '@/components/ReporteCalendar';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Reports() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fakeReports: { [key: string]: AlcoholUsage[] } = {
    '2025-06-04': [
      {
        name: 'Pisco',
        brand: 'Alto del Carmen',
        description: 'Pisco chileno 35º 1L. Frutal y suave.',
        bottlesUsed: 3,
        ouncesUsed: 8,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Alto_del_Carmen.png/200px-Alto_del_Carmen.png',
      },
      {
        name: 'Ron',
        brand: 'Havana Club',
        description: 'Ron añejo cubano. 7 años.',
        bottlesUsed: 1,
        ouncesUsed: 10,
        image: 'https://www.ronhavanaclub.com/sites/default/files/styles/product/public/2021-06/bottle-havana-club-7yo.png',
      },
      {
        name: 'Whisky',
        brand: 'Jameson',
        description: 'Whisky irlandés triple destilado.',
        bottlesUsed: 2,
        ouncesUsed: 4,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Jameson_Irish_Whiskey_Bottle.png/200px-Jameson_Irish_Whiskey_Bottle.png',
      },
    ],
  };

  const getFormattedDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return (
    <ScrollView style={{ backgroundColor: Colors.dark.background }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
      <Text style={styles.title}>REPORTES</Text>

      <View style={styles.calendarContainer}>
        <ReportCalendar
          daysWithData={Object.keys(fakeReports)}
          onSelectDate={(date) => {
            setSelectedDate(date);
          }}
        />
      </View>

      {selectedDate && (
        <DailyReportSummary
          date={selectedDate}
          data={fakeReports[getFormattedDateKey(selectedDate)] || []}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    paddingBottom: 40,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 60,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: Colors.dark.text,
    textTransform: 'uppercase',
  },
  calendarContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
