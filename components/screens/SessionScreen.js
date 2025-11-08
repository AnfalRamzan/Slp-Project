// components/screens/SessionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  BackHandler,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useChild } from '../context/ChildContext';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export default function SessionScreen({ route, navigation }) {
  const { 
    categoryId, 
    categoryName, 
    goalId, 
    goalTitle, 
    childId,
    goalActivities = [],
    onSessionComplete 
  } = route.params;

  const { childrenList, getGoalSessionStatus } = useChild();
  const currentChild = childrenList.find(child => child.id === childId);
  const sessionStatus = getGoalSessionStatus(childId, categoryId, goalId);

  const [activities, setActivities] = useState(
    goalActivities.length > 0
      ? goalActivities.map((act, i) => ({
          id: act.id || i + 1,
          name: act.name || `Activity ${i + 1}`,
          status: act.status ?? null,
        }))
      : Array(5)
          .fill(null)
          .map((_, i) => ({ id: i + 1, name: `Activity ${i + 1}`, status: null }))
  );

  const [doctorName, setDoctorName] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: `Session - ${currentChild?.childName || 'Child'}` });
  }, [currentChild]);

  useEffect(() => {
    const backAction = () => false;
    const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => handler.remove();
  }, []);

  const toggleStatus = (index, status) => {
    if (!sessionFinished) {
      setActivities(prev => prev.map((a, idx) => (idx === index ? { ...a, status } : a)));
    }
  };

  const getPassCount = () => activities.filter(a => a.status === true).length;

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setSessionDate(selectedDate);
  };

  const showDatepicker = () => setShowDatePicker(true);

  const formatDate = date =>
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleFinish = () => {
    if (!doctorName.trim()) {
      Alert.alert("Doctor Name Required", "Please enter your name before finishing the session.");
      return;
    }

    Alert.alert(
      "Confirm Finish",
      "Are you sure you want to end this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Finish",
          onPress: () => {
            const passCount = getPassCount();
            const sessionData = {
              doctorName: doctorName.trim(),
              passCount,
              activities,
              sessionDate: sessionDate.toISOString(),
              categoryId,
              categoryName,
              goalId,
              goalTitle,
              childId,
              childName: currentChild?.childName,
            };
            onSessionComplete(sessionData);
            setSessionFinished(true);
          },
        },
      ]
    );
  };

  if (!currentChild) {
    return (
      <View style={styles.container}>
        <Text>Child not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Therapy Session</Text>

      {/* Session Info */}
      <View style={styles.infoContainer}>
        {[["Child", currentChild.childName], ["MR Number", currentChild.mrNumber], ["Category", categoryName], ["Goal", goalTitle]].map(([label, value], idx) => (
          <View key={idx} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Goal Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.consecutiveTitle}>Goal Progress</Text>
        <View style={styles.circlesContainer}>
          {[1, 2, 3].map(num => (
            <View
              key={num}
              style={[
                styles.circle,
                num === sessionStatus.currentSession
                  ? styles.activeCircle
                  : styles.inactiveCircle,
              ]}
            >
              <Text style={[styles.circleText, num === sessionStatus.currentSession && styles.activeCircleText]}>
                {num}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.progressText}>Total sessions: {sessionStatus.totalSessions}</Text>
      </View>

      {/* Date Picker */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Session Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
          <Text style={styles.dateButtonText}>{formatDate(sessionDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={sessionDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      {/* Doctor Name */}
      <View style={styles.doctorInputContainer}>
        <Text style={styles.doctorLabel}>Your Name (Therapist/Doctor)</Text>
        <TextInput
          style={styles.doctorInput}
          placeholder="Enter your name"
          value={doctorName}
          onChangeText={setDoctorName}
          editable={!sessionFinished}
        />
      </View>

      {/* Activities */}
      <Text style={styles.activitiesTitle}>Session Activities</Text>
      <Text style={styles.activitiesSubtitle}>Mark activities as Pass or Fail</Text>

      {activities.map((activity, idx) => (
        <View key={activity.id} style={styles.activityCard}>
          <Text style={styles.activityNumber}>{activity.name}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.statusButton, styles.passButton, activity.status === true && styles.selectedPass]}
              onPress={() => toggleStatus(idx, true)}
            >
              <Text style={[styles.buttonText, activity.status === true && styles.selectedButtonText]}>
                ✅ PASS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, styles.failButton, activity.status === false && styles.selectedFail]}
              onPress={() => toggleStatus(idx, false)}
            >
              <Text style={[styles.buttonText, activity.status === false && styles.selectedButtonText]}>
                ❌ FAIL
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statusText}>
            {activity.status === true
              ? 'Result: PASS'
              : activity.status === false
                ? 'Result: FAIL'
                : 'Not marked'}
          </Text>
        </View>
      ))}

      {/* Activity Summary */}
      <View style={styles.activitySummary}>
        <Text style={styles.progressText}>
          Progress: {activities.filter(a => a.status !== null).length}/{activities.length} activities marked
        </Text>
        <Text style={styles.progressText}>
          Current Pass Count: {getPassCount()}/{activities.length}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.clearButton,
            sessionStatus.currentSession < 3 && { backgroundColor: '#a1a1aa' }
          ]}
          disabled={sessionStatus.currentSession < 3}
          onPress={() => {
            Alert.alert(
              "Report Generated",
              `Report for ${currentChild.childName} is ready!\nTotal Pass Count: ${getPassCount()}/${activities.length}`
            );
          }}
        >
          <Text style={styles.clearButtonText}>
            {sessionStatus.currentSession < 3 ? "Complete 3 Sessions" : "Generate Report"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.finishButton, sessionFinished && { backgroundColor: '#2563eb' }]}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>
            {sessionFinished ? "Session Finished" : "Finish Session"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Keep existing styles
const styles = StyleSheet.create({
  scrollContainer: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(6), backgroundColor: '#f7fafc' },
  title: { fontSize: responsiveFontSize(3), fontWeight: '700', marginBottom: responsiveHeight(2), textAlign: 'center', color: '#1f2937' },
  infoContainer: { backgroundColor: '#fff', padding: responsiveHeight(2), borderRadius: 12, marginBottom: responsiveHeight(2), elevation: 2 },
  infoRow: { marginBottom: responsiveHeight(1.2) },
  infoLabel: { fontSize: responsiveFontSize(1.6), fontWeight: '600', color: '#6b7280' },
  infoValue: { fontSize: responsiveFontSize(1.8), fontWeight: '500', color: '#1f2937' },
  progressContainer: { backgroundColor: '#fff', padding: responsiveHeight(2), borderRadius: 12, marginBottom: responsiveHeight(2), elevation: 2, alignItems: 'center' },
  consecutiveTitle: { fontSize: responsiveFontSize(2.2), fontWeight: '600', textAlign: 'center', marginBottom: responsiveHeight(2), color: '#1f2937' },
  circlesContainer: { flexDirection: 'row', justifyContent: 'space-between', width: responsiveWidth(60), marginBottom: responsiveHeight(1.5) },
  circle: { width: responsiveWidth(12), height: responsiveWidth(12), borderRadius: responsiveWidth(6), justifyContent: 'center', alignItems: 'center' },
  activeCircle: { backgroundColor: '#3b82f6' },
  inactiveCircle: { backgroundColor: '#d1d5db' },
  circleText: { color: '#fff', fontSize: responsiveFontSize(2), fontWeight: '700' },
  activeCircleText: { color: '#fff' },
  progressText: { fontSize: responsiveFontSize(1.6), color: '#6b7280', textAlign: 'center' },
  dateContainer: { backgroundColor: '#fff', padding: responsiveHeight(2), borderRadius: 12, marginBottom: responsiveHeight(2), elevation: 2 },
  dateLabel: { fontSize: responsiveFontSize(1.8), fontWeight: '600', marginBottom: responsiveHeight(1), color: '#1f2937' },
  dateButton: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingVertical: responsiveHeight(1.2), backgroundColor: '#f9fafb' },
  dateButtonText: { fontSize: responsiveFontSize(1.8), color: '#1f2937', textAlign: 'center' },
  doctorInputContainer: { backgroundColor: '#fff', padding: responsiveHeight(2), borderRadius: 12, marginBottom: responsiveHeight(2), elevation: 2 },
  doctorLabel: { fontSize: responsiveFontSize(1.8), fontWeight: '600', marginBottom: responsiveHeight(1), color: '#1f2937' },
  doctorInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingVertical: responsiveHeight(1.2), paddingHorizontal: responsiveWidth(3), fontSize: responsiveFontSize(1.8), backgroundColor: '#fff' },
  activitiesTitle: { fontSize: responsiveFontSize(2.2), fontWeight: '700', marginBottom: responsiveHeight(1), color: '#1f2937' },
  activitiesSubtitle: { fontSize: responsiveFontSize(1.6), color: '#6b7280', marginBottom: responsiveHeight(2) },
  activityCard: { backgroundColor: '#fff', padding: responsiveHeight(2), borderRadius: 12, marginBottom: responsiveHeight(2), elevation: 2 },
  activityNumber: { fontSize: responsiveFontSize(2), fontWeight: '600', marginBottom: responsiveHeight(1), color: '#1f2937' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveHeight(1) },
  statusButton: { flex: 1, paddingVertical: responsiveHeight(1.2), borderRadius: 8, alignItems: 'center', marginHorizontal: responsiveWidth(1) },
  passButton: { backgroundColor: '#f0fdf4', borderWidth: 2, borderColor: '#bbf7d0' },
  failButton: { backgroundColor: '#fef2f2', borderWidth: 2, borderColor: '#fecaca' },
  selectedPass: { backgroundColor: '#10b981', borderColor: '#10b981' },
  selectedFail: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  buttonText: { fontSize: responsiveFontSize(1.6), fontWeight: '600' },
  selectedButtonText: { color: '#fff' },
  statusText: { fontSize: responsiveFontSize(1.6), textAlign: 'center', color: '#6b7280', fontStyle: 'italic' },
  activitySummary: { backgroundColor: '#fff', padding: responsiveHeight(2), borderRadius: 12, marginBottom: responsiveHeight(2), elevation: 2 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveHeight(4) },
  clearButton: { flex: 1, backgroundColor: '#6b7280', paddingVertical: responsiveHeight(1.5), borderRadius: 8, alignItems: 'center', marginRight: responsiveWidth(2) },
  clearButtonText: { color: '#fff', fontWeight: '600', fontSize: responsiveFontSize(1.8) },
  finishButton: { flex: 2, backgroundColor: '#3b82f6', paddingVertical: responsiveHeight(1.5), borderRadius: 8, alignItems: 'center', marginLeft: responsiveWidth(2) },
  finishButtonText: { color: '#fff', fontWeight: '600', fontSize: responsiveFontSize(1.8) },
});
