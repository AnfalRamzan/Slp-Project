// components/screens/ChildReportScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useChild } from '../context/ChildContext';

export default function ChildReportScreen({ route, navigation }) {
  const { childId } = route.params;
  const { childrenList, getChildReport } = useChild();

  const report = getChildReport(childId);
  const child = childrenList.find(c => c.id === childId);

  if (!report || !child) {
    return (
      <View style={styles.container}>
        <Text>Child not found</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareReport = () => {
    Alert.alert("Share Report", "Report sharing feature would be implemented here");
  };

  const getCategoryName = (categoryId) => {
    switch(categoryId) {
      case 'F80.2': return 'Receptive Language';
      case 'F80.1': return 'Expressive Language';
      case 'H90': return 'Hearing Impairment';
      default: return categoryId;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.childName}>{child.childName}</Text>
        <Text style={styles.mrNumber}>MR: {child.mrNumber}</Text>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age/DOB</Text>
            <Text style={styles.infoValue}>{child.dob || 'Not specified'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{child.gender || 'Not specified'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Parent</Text>
            <Text style={styles.infoValue}>{child.parentName || 'Not specified'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Since</Text>
            <Text style={styles.infoValue}>{formatDate(child.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Progress Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Summary</Text>
        <View style={styles.progressGrid}>
          <View style={[styles.progressItem, styles.totalSessions]}>
            <Text style={styles.progressNumber}>{report.totalSessions}</Text>
            <Text style={styles.progressLabel}>Total Sessions</Text>
          </View>
          <View style={[styles.progressItem, styles.passedSessions]}>
            <Text style={styles.progressNumber}>{report.passedSessions}</Text>
            <Text style={styles.progressLabel}>Passed Sessions</Text>
          </View>
          <View style={[styles.progressItem, styles.successRate]}>
            <Text style={styles.progressNumber}>{report.successRate}%</Text>
            <Text style={styles.progressLabel}>Success Rate</Text>
          </View>
        </View>
      </View>

      {/* Recent Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {report.lastSession ? (
          <View style={styles.lastSession}>
            <Text style={styles.sessionTitle}>Last Session</Text>
            <Text style={styles.sessionDetail}>
              Date: {formatDate(report.lastSession.date)}
            </Text>
            <Text style={styles.sessionDetail}>
              Result: <Text style={report.lastSession.isPassed ? styles.passed : styles.failed}>
                {report.lastSession.isPassed ? 'PASSED' : 'FAILED'}
              </Text>
            </Text>
            <Text style={styles.sessionDetail}>
              Conducted by: {report.lastSession.doctorName}
            </Text>
            <Text style={styles.sessionDetail}>
              Activities: {report.lastSession.passCount}/5 passed
            </Text>
            <Text style={styles.sessionDetail}>
              Category: {getCategoryName(report.lastSession.categoryId)}
            </Text>
          </View>
        ) : (
          <Text style={styles.noSessions}>No sessions completed yet</Text>
        )}
      </View>

      {/* Category Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress by Category</Text>
        {Object.keys(report.sessionsByCategory).length > 0 ? (
          Object.entries(report.sessionsByCategory).map(([categoryId, sessions]) => {
            const categoryStats = report.categoryProgress[categoryId];
            return (
              <View key={categoryId} style={styles.categoryProgress}>
                <Text style={styles.categoryName}>
                  {getCategoryName(categoryId)}
                </Text>
                <Text style={styles.categorySessions}>
                  {sessions.length} session(s) - {categoryStats.passed} passed
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${categoryStats.successRate}%`,
                        backgroundColor: categoryStats.successRate > 70 ? '#10b981' : 
                                        categoryStats.successRate > 40 ? '#f59e0b' : '#ef4444'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.successRateText}>
                  Success Rate: {categoryStats.successRate}%
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noSessions}>No category progress yet</Text>
        )}
      </View>

      {/* Session History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session History</Text>
        {child.sessions && child.sessions.length > 0 ? (
          child.sessions.slice().reverse().map((session, index) => (
            <View key={session.id} style={styles.sessionHistoryItem}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                <Text style={session.isPassed ? styles.sessionPassed : styles.sessionFailed}>
                  {session.isPassed ? 'PASS' : 'FAIL'}
                </Text>
              </View>
              <Text style={styles.sessionDetail}>
                {getCategoryName(session.categoryId)} • {session.doctorName}
              </Text>
              <Text style={styles.sessionDetail}>
                Activities: {session.passCount}/5 passed
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSessions}>No session history available</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CategoryList')}
        >
          <Text style={styles.actionButtonText}>Start New Session</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={shareReport}
        >
          <Text style={styles.actionButtonText}>Share Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  childName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  mrNumber: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    width: '30%',
  },
  totalSessions: {
    backgroundColor: '#dbeafe',
  },
  passedSessions: {
    backgroundColor: '#dcfce7',
  },
  successRate: {
    backgroundColor: '#fef3c7',
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  lastSession: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937',
  },
  sessionDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  passed: {
    color: '#10b981',
    fontWeight: '600',
  },
  failed: {
    color: '#ef4444',
    fontWeight: '600',
  },
  categoryProgress: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  categorySessions: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  successRateText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  sessionHistoryItem: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  sessionPassed: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sessionFailed: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noSessions: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  shareButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});