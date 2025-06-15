import { CalendarCard } from '@/components/CalendarCard';
import { Colors } from '@/constants/Colors';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  daysWithData: string[]; // Ej: ['2025-06-01', '2025-06-10']
  onSelectDate: (date: Date) => void;
};

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function ReportCalendar({ daysWithData, onSelectDate }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextYear = () => setCurrentDate(new Date(year + 1, month, 1));
  const goToPrevYear = () => setCurrentDate(new Date(year - 1, month, 1));

  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstWeekDay + daysInMonth) / 7) * 7;

  const daysArray = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - firstWeekDay + 1;
    if (dayNumber < 1) {
      return {
        day: prevMonthDays + dayNumber,
        isCurrentMonth: false,
      };
    } else if (dayNumber > daysInMonth) {
      return {
        day: dayNumber - daysInMonth,
        isCurrentMonth: false,
      };
    } else {
      return {
        day: dayNumber,
        isCurrentMonth: true,
      };
    }
  });

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();
  

  const isDateWithData = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return daysWithData.includes(dateStr);
  };

  const handleSelect = (day: number) => {
    const fullDate = new Date(year, month, day);
    setSelectedDate(fullDate);
    onSelectDate(fullDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevYear}>
          <ChevronLeft size={20} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{year}</Text>
        <TouchableOpacity onPress={goToNextYear}>
          <ChevronRight size={20} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
      <TouchableOpacity onPress={goToPrevMonth} style={styles.arrow}>
        <ChevronLeft size={20} color={Colors.dark.text} />
      </TouchableOpacity>
      <View style={styles.monthWrapper}>
        <Text style={styles.headerText}>{monthNames[month]}</Text>
      </View>
      <TouchableOpacity onPress={goToNextMonth} style={styles.arrow}>
        <ChevronRight size={20} color={Colors.dark.text} />
      </TouchableOpacity>
    </View>


      <View style={styles.grid}>
        <View style={styles.weekRow}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
            <View key={i} style={styles.dayHeaderBox}>
              <Text style={styles.weekDay}>{d}</Text>
            </View>
          ))}
        </View>

        {Array.from({ length: daysArray.length / 7 }).map((_, weekIndex) => {
          const weekDays = daysArray.slice(weekIndex * 7, weekIndex * 7 + 7);
          return (
            <View key={weekIndex} style={styles.weekRow}>
              {weekDays.map((dayObj, i) => (
                <CalendarCard
                  key={i}
                  day={dayObj.day}
                  selected={
                    dayObj.isCurrentMonth &&
                    selectedDate?.getDate() === dayObj.day &&
                    selectedDate?.getMonth() === month &&
                    selectedDate?.getFullYear() === year
                  }
                  hasData={dayObj.isCurrentMonth && isDateWithData(dayObj.day)}
                  isToday={dayObj.isCurrentMonth && isToday(dayObj.day)}
                  onPress={() => {
                    if (dayObj.isCurrentMonth) {
                      handleSelect(dayObj.day);
                    }
                  }}
                  dimmed={!dayObj.isCurrentMonth}
                />

              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  arrow: {
    width: 40,
    alignItems: 'center',
  },

  monthWrapper: {
    minWidth: 120,
    alignItems: 'center',
  },

  headerText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'column',
    gap: 6,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dayHeaderBox: {
    width: 44,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  weekDay: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
