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

export default function SessionScreen({ route, navigation }) {
  const { 
    categoryId, 
    categoryName, 
    goalId, 
    goalTitle, 
    childId,
    onSessionComplete 
  } = route.params;

  const { childrenList, getGoalSessionStatus } = useChild();
  const currentChild = childrenList.find(child => child.id === childId);
  const sessionStatus = getGoalSessionStatus(childId, categoryId, goalId);

  const [activities, setActivities] = useState(
    Array(5).fill(null).map((_, i) => ({
      id: i + 1,
      status: null,
    }))
  );

  const [doctorName, setDoctorName] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Set screen title
  useEffect(() => {
    navigation.setOptions({
      title: `Session - ${currentChild?.childName || 'Child'}`
    });
  }, [currentChild]);

  // Prevent back press until session completed
  useEffect(() => {
    const backAction = () => {
      if (!isSessionComplete()) {
        Alert.alert(
          "Finish Session",
          "You must complete all 5 activities before leaving.",
          [{ text: "OK" }]
        );
        return true;
      }
      return false;
    };

    const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => handler.remove();
  }, [activities]);

  const toggleStatus = (index, status) => {
    setActivities((prev) =>
      prev.map((a, idx) =>
        idx === index ? { ...a, status: status } : a
      )
    );
  };

  const isSessionComplete = () => activities.every((a) => a.status !== null);

  const getPassCount = () => activities.filter((a) => a.status === true).length;

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSessionDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFinish = () => {
    if (!isSessionComplete()) {
      Alert.alert("Incomplete", "Mark all 5 activities before finishing.");
      return;
    }

    if (!doctorName.trim()) {
      Alert.alert("Doctor Name Required", "Please enter your name before finishing the session.");
      return;
    }

    const passCount = getPassCount();
    const isPass = passCount >= 3;

    Alert.alert(
      isPass ? "Session Passed! 🎉" : "Session Failed 😔",
      `${passCount} out of 5 activities passed. ${isPass ? 'Great job!' : 'Keep practicing!'}`,
      [
        {
          text: "OK",
          onPress: () => {
            // Send session data including all context
            const sessionData = {
              isPassed: isPass,
              doctorName: doctorName.trim(),
              passCount: passCount,
              activities: activities,
              sessionDate: sessionDate.toISOString(),
              categoryId: categoryId,
              categoryName: categoryName,
              goalId: goalId,
              goalTitle: goalTitle,
              childId: childId,
              childName: currentChild?.childName
            };
            
            console.log('Completing session with data:', sessionData);
            onSessionComplete(sessionData);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const clearAll = () => {
    setActivities(activities.map(a => ({ ...a, status: null })));
  };

  if (!currentChild) {
    return (
      <View style={styles.container}>
        <Text>Child not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Therapy Session</Text>

      {/* Session Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Child</Text>
        <Text style={styles.infoValue}>{currentChild.childName}</Text>
        
        <Text style={styles.infoLabel}>MR Number</Text>
        <Text style={styles.infoValue}>{currentChild.mrNumber}</Text>
        
        <Text style={styles.infoLabel}>Category</Text>
        <Text style={styles.infoValue}>{categoryName}</Text>
        
        <Text style={styles.infoLabel}>Goal</Text>
        <Text style={styles.infoValue}>{goalTitle}</Text>
      </View>

      {/* Consecutive Session Progress */}
      <View style={styles.consecutiveProgress}>
        <Text style={styles.consecutiveTitle}>Goal Progress</Text>
        <Text style={styles.consecutiveSubtitle}>
          Need 3 consecutive passed sessions to complete this goal
        </Text>
        <View style={styles.progressDots}>
          {[1, 2, 3].map((dot, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index < sessionStatus.consecutivePasses && styles.progressDotPassed
              ]}
            >
              <Text style={styles.progressDotText}>
                {index < sessionStatus.consecutivePasses ? '✓' : index + 1}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.progressText}>
          Current streak: {sessionStatus.consecutivePasses} consecutive passes
        </Text>
        <Text style={styles.progressText}>
          Total sessions: {sessionStatus.totalSessions}
        </Text>
      </View>

      {/* Session Date Picker */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Session Date *</Text>
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

      {/* Doctor Name Input */}
      <View style={styles.doctorInputContainer}>
        <Text style={styles.doctorLabel}>Your Name (Therapist/Doctor) *</Text>
        <TextInput
          style={styles.doctorInput}
          placeholder="Enter your name"
          value={doctorName}
          onChangeText={setDoctorName}
        />
      </View>

      <Text style={styles.activitiesTitle}>Session Activities</Text>
      <Text style={styles.activitiesSubtitle}>
        Mark all 5 activities as Pass or Fail
      </Text>

      {/* Activities */}
      {activities.map((activity, index) => (
        <View key={activity.id} style={styles.activityCard}>
          <Text style={styles.activityNumber}>Activity {activity.id}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                styles.passButton,
                activity.status === true && styles.selectedPass,
              ]}
              onPress={() => toggleStatus(index, true)}
            >
              <Text style={[
                styles.buttonText,
                activity.status === true && styles.selectedButtonText
              ]}>
                ✅ PASS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                styles.failButton,
                activity.status === false && styles.selectedFail,
              ]}
              onPress={() => toggleStatus(index, false)}
            >
              <Text style={[
                styles.buttonText,
                activity.status === false && styles.selectedButtonText
              ]}>
                ❌ FAIL
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.statusText}>
            {activity.status === null 
              ? "Not marked" 
              : activity.status ? "Marked: PASS" : "Marked: FAIL"
            }
          </Text>
        </View>
      ))}

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {activities.filter(a => a.status !== null).length}/5 activities marked
        </Text>
        <Text style={styles.progressText}>
          Current Pass Count: {getPassCount()}/5
        </Text>
        <Text style={styles.requirementText}>
          (Need at least 3 passes to complete session)
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAll}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.finishButton,
            (!isSessionComplete() || !doctorName.trim()) && styles.disabledButton,
          ]}
          disabled={!isSessionComplete() || !doctorName.trim()}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>
            Finish Session
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1f2937',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
  },
  consecutiveProgress: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  consecutiveTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  consecutiveSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  progressDotPassed: {
    backgroundColor: '#10b981',
  },
  progressDotText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  dateContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  doctorInputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  doctorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937',
  },
  doctorInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  activitiesTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1f2937',
  },
  activitiesSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activityNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  passButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  failButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  selectedPass: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  selectedFail: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: '#fff',
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  finishButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});