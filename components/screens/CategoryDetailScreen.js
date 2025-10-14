// components/screens/CategoryDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { initialGoalBank } from '../data/goalBank';
import { useChild } from '../context/ChildContext';

export default function CategoryDetailScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const { selectedChild, updateChildProgress, getUnlockedGoals, getCurrentGoal, getGoalSessionStatus, refreshTrigger } = useChild();
  const [goalBank] = useState(initialGoalBank);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [unlockedGoals, setUnlockedGoals] = useState([]);
  const [currentActiveGoal, setCurrentActiveGoal] = useState(null);

  useEffect(() => {
    const category = goalBank.find(cat => cat.id === categoryId);
    setCurrentCategory(category);
  }, [categoryId, goalBank]);

  // Refresh goals list when data changes
  useEffect(() => {
    if (selectedChild && currentCategory) {
      console.log('🔄 REFRESHING GOALS LIST - Trigger:', refreshTrigger);
      const unlocked = getUnlockedGoals(selectedChild.id, categoryId);
      setUnlockedGoals(unlocked);
      
      const currentGoal = getCurrentGoal(selectedChild.id, categoryId);
      setCurrentActiveGoal(currentGoal);

      console.log('📋 CURRENT GOALS STATE:', {
        unlockedGoals: unlocked.map(g => g.goalId),
        currentGoal: currentGoal?.goalId
      });
    }
  }, [selectedChild, currentCategory, categoryId, refreshTrigger]);

  // Initialize first goal if no progress exists
  useEffect(() => {
    if (selectedChild && currentCategory && unlockedGoals.length === 0) {
      const firstGoal = currentCategory.goals[0];
      if (firstGoal) {
        setUnlockedGoals([{
          goalId: firstGoal.id,
          sessions: [],
          passed: false,
          unlocked: true
        }]);
        setCurrentActiveGoal({
          goalId: firstGoal.id,
          sessions: [],
          passed: false,
          unlocked: true
        });
      }
    }
  }, [selectedChild, currentCategory, unlockedGoals]);

  const handleStartSession = (goalId, goalTitle) => {
    if (!currentCategory || !selectedChild) {
      Alert.alert("Error", "Please select a child first");
      navigation.navigate('Home');
      return;
    }

    const goalProgress = unlockedGoals.find(g => g.goalId === goalId);
    if (!goalProgress?.unlocked) {
      Alert.alert("Goal Locked", "Complete previous goals to unlock this one.");
      return;
    }

    console.log('🎯 Starting session for:', {
      child: selectedChild.childName,
      category: currentCategory.title,
      goal: goalTitle
    });

    navigation.navigate('SessionScreen', {
      categoryId: currentCategory.id,
      categoryName: currentCategory.title,
      goalId: goalId,
      goalTitle: goalTitle,
      childId: selectedChild.id,
      onSessionComplete: (sessionData) => {
        console.log('✅ Session completed, updating progress:', sessionData);
        updateChildProgress(selectedChild.id, currentCategory.id, goalId, sessionData);
        
        // Show success message
        const message = sessionData.isPassed ? 
          `Session passed! ${sessionData.passCount}/5 activities completed successfully.` :
          `Session completed. ${sessionData.passCount}/5 activities passed. Keep practicing!`;
        
        Alert.alert(
          "Session Saved", 
          message,
          [{ text: "OK" }]
        );
      }
    });
  };

  const getGoalDetails = (goalId) => {
    return currentCategory?.goals.find(g => g.id === goalId);
  };

  if (!currentCategory) {
    return (
      <View style={styles.container}>
        <Text>Loading category...</Text>
      </View>
    );
  }

  if (!selectedChild) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No child selected</Text>
        <Text style={styles.errorSubtext}>
          Please select a child before starting therapy sessions
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Select a Child</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{currentCategory.title}</Text>
      
      <View style={styles.childInfo}>
        <Text style={styles.childInfoText}>
          Working with: <Text style={styles.childName}>{selectedChild.childName}</Text>
        </Text>
        <Text style={styles.mrNumber}>MR: {selectedChild.mrNumber}</Text>
      </View>

      {/* Progress Overview */}
      <View style={styles.progressOverview}>
        <Text style={styles.progressTitle}>Progress Overview</Text>
        <View style={styles.progressStats}>
          <View style={styles.progressStat}>
            <Text style={styles.progressNumber}>
              {unlockedGoals.filter(g => g.passed).length}
            </Text>
            <Text style={styles.progressLabel}>Goals Completed</Text>
          </View>
          <View style={styles.progressStat}>
            <Text style={styles.progressNumber}>
              {unlockedGoals.length}
            </Text>
            <Text style={styles.progressLabel}>Goals Unlocked</Text>
          </View>
          <View style={styles.progressStat}>
            <Text style={styles.progressNumber}>
              {currentCategory.goals.length}
            </Text>
            <Text style={styles.progressLabel}>Total Goals</Text>
          </View>
        </View>
      </View>

      <Text style={styles.subtitle}>
        {currentActiveGoal ? 
          `Current Goal: ${getGoalDetails(currentActiveGoal.goalId)?.title}` :
          'Select a goal to start a session'
        }
      </Text>

      {/* Goals List */}
      {currentCategory.goals.map((goal, index) => {
        const goalProgress = unlockedGoals.find(g => g.goalId === goal.id);
        const isUnlocked = goalProgress?.unlocked;
        const isPassed = goalProgress?.passed;
        const isCurrent = currentActiveGoal?.goalId === goal.id;
        const sessionStatus = getGoalSessionStatus(selectedChild.id, categoryId, goal.id);
        
        const sessionStatusText = isPassed ? '✓ Completed' : 
                                sessionStatus.consecutivePasses > 0 ? 
                                `${sessionStatus.consecutivePasses}/3 consecutive passes` : 
                                'Not started';
        
        const sessionStatusColor = isPassed ? '#10b981' : 
                                  sessionStatus.consecutivePasses > 0 ? '#f59e0b' : '#6b7280';

        return (
          <View
            key={goal.id}
            style={[
              styles.goalCard,
              isCurrent && styles.currentGoalCard,
              !isUnlocked && styles.lockedGoalCard
            ]}
          >
            {/* Goal Header */}
            <View style={styles.goalHeader}>
              <View style={styles.goalTitleContainer}>
                <Text style={[
                  styles.goalTitle,
                  !isUnlocked && styles.lockedGoalText,
                  isPassed && styles.passedGoalText
                ]}>
                  {goal.title}
                </Text>
                <Text style={styles.goalId}>{goal.id}</Text>
              </View>
              
              {/* Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: sessionStatusColor + '20' }]}>
                <Text style={[styles.statusText, { color: sessionStatusColor }]}>
                  {sessionStatusText}
                </Text>
              </View>
            </View>

            {/* Consecutive Session Progress */}
            {isUnlocked && !isPassed && (
              <View style={styles.consecutiveProgress}>
                <Text style={styles.consecutiveTitle}>
                  Progress: {sessionStatus.consecutivePasses}/3 consecutive passes needed
                </Text>
                
                {/* Streak Status Messages */}
                {sessionStatus.streakBroken && sessionStatus.consecutivePasses === 0 && (
                  <View style={styles.streakBrokenWarning}>
                    <Text style={styles.streakBrokenText}>
                      🔥 Streak broken! Start a new consecutive pass sequence.
                    </Text>
                  </View>
                )}
                {sessionStatus.streakBroken && sessionStatus.consecutivePasses > 0 && (
                  <View style={styles.streakWarning}>
                    <Text style={styles.streakWarningText}>
                      ⚠️ Failed session in streak. Need {3 - sessionStatus.consecutivePasses} more consecutive passes.
                    </Text>
                  </View>
                )}
                {!sessionStatus.streakBroken && sessionStatus.consecutivePasses > 0 && (
                  <View style={styles.streakActive}>
                    <Text style={styles.streakActiveText}>
                      🔥 Active streak! {sessionStatus.consecutivePasses} consecutive passes.
                    </Text>
                  </View>
                )}
                
                <View style={styles.progressBar}>
                  {[1, 2, 3].map((step, index) => (
                    <View
                      key={step}
                      style={[
                        styles.progressStep,
                        index < sessionStatus.consecutivePasses && styles.progressStepCompleted,
                        index === sessionStatus.consecutivePasses && styles.progressStepCurrent,
                        sessionStatus.streakBroken && index >= sessionStatus.consecutivePasses && styles.progressStepBroken
                      ]}
                    >
                      <Text style={[
                        styles.progressStepText,
                        index < sessionStatus.consecutivePasses && styles.progressStepTextCompleted
                      ]}>
                        {index < sessionStatus.consecutivePasses ? '✓' : step}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.sessionCount}>
                  {sessionStatus.totalSessions} session(s) completed
                </Text>
              </View>
            )}

            {/* Session History Dots */}
            {isUnlocked && goalProgress?.sessions && goalProgress.sessions.length > 0 && (
              <View style={styles.sessionProgress}>
                <Text style={styles.sessionProgressTitle}>Recent Sessions:</Text>
                <View style={styles.sessionDots}>
                  {goalProgress.sessions.slice(-6).map((session, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.sessionDot,
                        session.isPassed ? styles.passedSession : styles.failedSession
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Action Button */}
            {isUnlocked && !isPassed && (
              <TouchableOpacity
                style={[
                  styles.sessionButton,
                  isCurrent && styles.currentSessionButton
                ]}
                onPress={() => handleStartSession(goal.id, goal.title)}
              >
                <Text style={styles.sessionButtonText}>
                  {isCurrent ? 'Continue Session' : 'Start Session'}
                </Text>
              </TouchableOpacity>
            )}

            {isPassed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>🎉 Goal Completed! Next goal unlocked</Text>
              </View>
            )}

            {!isUnlocked && (
              <Text style={styles.lockedMessage}>
                🔒 Complete previous goals to unlock
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1f2937',
  },
  childInfo: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  childInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  childName: {
    fontWeight: '700',
  },
  mrNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  progressOverview: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b7280',
    fontWeight: '600',
  },
  goalCard: {
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
  currentGoalCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
    backgroundColor: '#f0f9ff',
  },
  lockedGoalCard: {
    backgroundColor: '#f3f4f6',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  lockedGoalText: {
    color: '#9ca3af',
  },
  passedGoalText: {
    color: '#10b981',
  },
  goalId: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  consecutiveProgress: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  consecutiveTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  streakBrokenWarning: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  streakBrokenText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
    textAlign: 'center',
  },
  streakWarning: {
    backgroundColor: '#fffbeb',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  streakWarningText: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '600',
    textAlign: 'center',
  },
  streakActive: {
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  streakActiveText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepCompleted: {
    backgroundColor: '#10b981',
  },
  progressStepCurrent: {
    backgroundColor: '#3b82f6',
  },
  progressStepBroken: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  progressStepTextCompleted: {
    color: '#fff',
  },
  sessionCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  sessionProgress: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  sessionProgressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sessionDots: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  passedSession: {
    backgroundColor: '#10b981',
  },
  failedSession: {
    backgroundColor: '#ef4444',
  },
  sessionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  currentSessionButton: {
    backgroundColor: '#1d4ed8',
  },
  sessionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    color: '#166534',
    fontWeight: '600',
    fontSize: 14,
  },
  lockedMessage: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
    color: '#ef4444',
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});