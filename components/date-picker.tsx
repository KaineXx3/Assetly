import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth } from 'date-fns';
import { Button } from './ui/button';

interface DatePickerProps {
  label?: string;
  value: string; // ISO string
  onChangeDate: (date: string) => void;
  maxDate?: Date;
  minDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChangeDate,
  maxDate,
  minDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(value || new Date()));
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date(value || new Date())));

  const handleConfirm = () => {
    onChangeDate(tempDate.toISOString());
    setShowPicker(false);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setTempDate(newDate);
  };

  const displayDate = format(new Date(value || new Date()), 'yyyy年MM月dd日');
  const today = new Date();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = startOfMonth(currentMonth).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.inputText}>{displayDate}</Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {showPicker && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Month/Year Navigation */}
              <View style={styles.monthNavigator}>
                <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <Text style={styles.navButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.monthYear}>
                  {format(currentMonth, 'yyyy年MM月')}
                </Text>
                <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <Text style={styles.navButton}>{'>'}</Text>
                </TouchableOpacity>
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarContainer}>
                {/* Weekday headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.weekdayHeader}>
                    {day}
                  </Text>
                ))}

                {/* Days */}
                {days.map((day, index) => {
                  const isSelected =
                    day &&
                    tempDate.getDate() === day &&
                    tempDate.getMonth() === currentMonth.getMonth() &&
                    tempDate.getFullYear() === currentMonth.getFullYear();

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        day === null && styles.dayButtonEmpty,
                        isSelected ? styles.dayButtonSelected : undefined,
                      ].filter(Boolean) as any}
                      onPress={() => day && handleDateSelect(day)}
                      disabled={day === null}
                    >
                      {day && (
                        <Text
                          style={[
                            styles.dayText,
                            day === null && styles.dayTextEmpty,
                            isSelected ? styles.dayTextSelected : undefined,
                          ].filter(Boolean) as any}
                        >
                          {day}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalFooter}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  size="medium"
                  onPress={() => setShowPicker(false)}
                  style={styles.footerButton}
                />
                <Button
                  title="Confirm"
                  size="medium"
                  onPress={handleConfirm}
                  style={styles.footerButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  inputText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  icon: {
    fontSize: 18,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
    color: '#999999',
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  navButton: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6366F1',
    paddingHorizontal: 12,
  },
  monthYear: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  weekdayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 8,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 6,
  },
  dayButtonEmpty: {
    backgroundColor: 'transparent',
  },
  dayButtonSelected: {
    backgroundColor: '#6366F1',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  dayTextEmpty: {
    color: 'transparent',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 8,
  },
  footerButton: {
    flex: 1,
  },
  iosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  iosDatePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});
