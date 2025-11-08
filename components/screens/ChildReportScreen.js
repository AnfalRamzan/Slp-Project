// components/screens/ChildReportScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useChild } from '../context/ChildContext';

export default function ChildReportScreen({ route }) {
  const { childId } = route.params;
  const { childrenList, getChildReport } = useChild();
  const [report, setReport] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const childReport = getChildReport(childId);
    setReport(childReport);
  }, [childId, childrenList, refreshKey]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setRefreshing(false), 500);
  };

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
    Alert.alert("Refreshed", "Report data has been refreshed.");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  const shareReport = () => {
    Alert.alert("Share Report", "Report sharing feature would be implemented here");
  };

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading report...</Text>
        <Text style={styles.loadingSubtext}>Child ID: {childId}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={forceRefresh}>
          <Text style={styles.refreshButtonText}>Refresh Report</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getCategoryName = (id) => {
    switch(id) {
      case 'F80.2': return 'Receptive Language';
      case 'F80.1': return 'Expressive Language';
      case 'H90': return 'Hearing Impairment';
      default: return id;
    }
  };

  const totalGoals = Object.values(report.childInfo.goalsProgress || {}).reduce(
    (total, category) => total + Object.values(category).filter(goal => goal.unlocked).length, 0
  );

  const completedGoals = Object.values(report.childInfo.goalsProgress || {}).reduce(
    (total, category) => total + Object.values(category).filter(goal => goal.passed).length, 0
  );

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.childName}>{report.childInfo.childName}</Text>
        <Text style={styles.mrNumber}>MR: {report.childInfo.mrNumber}</Text>
        <Text style={styles.lastUpdated}>Report generated: {formatDate(new Date())}</Text>
        <Text style={styles.dataStatus}>
          Data: {report.totalSessions} sessions • {completedGoals}/{totalGoals} goals completed
        </Text>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.infoGrid}>
          {[
            ["Age/DOB", report.childInfo.dob || 'Not specified'],
            ["Gender", report.childInfo.gender || 'Not specified'],
            ["Parent", report.childInfo.parentName || 'Not specified'],
            ["Since", formatDate(report.childInfo.createdAt)]
          ].map(([label, value]) => (
            <View key={label} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
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
          <View style={[styles.progressItem, styles.goalsProgress]}>
            <Text style={styles.progressNumber}>{completedGoals}/{totalGoals}</Text>
            <Text style={styles.progressLabel}>Goals Completed</Text>
          </View>
        </View>
      </View>

      {/* Recent Session */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {report.lastSession ? (
          <View style={styles.lastSession}>
            <Text style={styles.sessionTitle}>Last Session</Text>
            <Text style={styles.sessionDetail}>Date: {formatDate(report.lastSession.date)}</Text>
            <Text style={styles.sessionDetail}>
              Result: <Text style={report.lastSession.isPassed ? styles.passed : styles.failed}>
                {report.lastSession.isPassed ? 'PASSED' : 'FAILED'}
              </Text>
            </Text>
            <Text style={styles.sessionDetail}>Therapist: {report.lastSession.doctorName}</Text>
            <Text style={styles.sessionDetail}>Activities: {report.lastSession.passCount}/5 passed</Text>
            <Text style={styles.sessionDetail}>Category: {getCategoryName(report.lastSession.categoryId)}</Text>
            <Text style={styles.sessionDetail}>Goal: {report.lastSession.goalTitle}</Text>
          </View>
        ) : <Text style={styles.noSessions}>No sessions completed yet</Text>}
      </View>

      {/* Category Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress by Category</Text>
        {Object.keys(report.sessionsByCategory).length > 0 ? (
          Object.entries(report.sessionsByCategory).map(([catId, sessions]) => {
            const stats = report.categoryProgress[catId];
            return (
              <View key={catId} style={styles.categoryProgress}>
                <Text style={styles.categoryName}>{getCategoryName(catId)}</Text>
                <Text style={styles.categorySessions}>
                  {sessions.length} session(s) • {stats.passed} passed • {stats.successRate}% success
                </Text>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill,
                    { width: `${stats.successRate}%`, backgroundColor: stats.successRate > 70 ? '#10b981' : stats.successRate > 40 ? '#f59e0b' : '#ef4444' }
                  ]} />
                </View>
              </View>
            );
          })
        ) : <Text style={styles.noSessions}>No category progress yet</Text>}
      </View>

      {/* Session History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session History</Text>
        {report.childInfo.sessions?.length > 0 ? (
          report.childInfo.sessions.slice().reverse().map((s, idx) => (
            <View key={s.id || idx} style={styles.sessionHistoryItem}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionDate}>{formatDate(s.date)}</Text>
                <Text style={s.isPassed ? styles.sessionPassed : styles.sessionFailed}>
                  {s.isPassed ? 'PASS' : 'FAIL'}
                </Text>
              </View>
              <Text style={styles.sessionDetail}>{getCategoryName(s.categoryId)} • {s.doctorName}</Text>
              <Text style={styles.sessionDetail}>Goal: {s.goalTitle}</Text>
              <Text style={styles.sessionDetail}>Activities: {s.passCount}/5 passed</Text>
            </View>
          ))
        ) : <Text style={styles.noSessions}>No session history available</Text>}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.refreshButton]} onPress={forceRefresh}>
          <Text style={styles.actionButtonText}>Refresh Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={shareReport}>
          <Text style={styles.actionButtonText}>Share Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Keep styles mostly same, simplified for better spacing and readability
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc', padding: 16 },
  header: { alignItems: 'center', marginBottom: 24, padding: 16, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  childName: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  mrNumber: { fontSize: 16, color: '#6b7280', marginBottom: 4 },
  lastUpdated: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic', marginBottom: 4 },
  dataStatus: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  infoItem: { width: '48%', marginBottom: 12 },
  infoLabel: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  progressItem: { alignItems: 'center', padding: 12, borderRadius: 8, width: '48%', marginBottom: 8 },
  totalSessions: { backgroundColor: '#dbeafe' },
  passedSessions: { backgroundColor: '#dcfce7' },
  successRate: { backgroundColor: '#fef3c7' },
  goalsProgress: { backgroundColor: '#f3e8ff' },
  progressNumber: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  progressLabel: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 4 },
  lastSession: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8 },
  sessionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#1f2937' },
  sessionDetail: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  passed: { color: '#10b981', fontWeight: '600' },
  failed: { color: '#ef4444', fontWeight: '600' },
  categoryProgress: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  categorySessions: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 4 },
  sessionHistoryItem: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 8 },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sessionDate: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  sessionPassed: { fontSize: 12, color: '#10b981', fontWeight: '600', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  sessionFailed: { fontSize: 12, color: '#ef4444', fontWeight: '600', backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  noSessions: { fontSize: 14, color: '#6b7280', fontStyle: 'italic', textAlign: 'center' },
  loadingText: { fontSize: 18, textAlign: 'center', marginBottom: 8, color: '#6b7280' },
  loadingSubtext: { fontSize: 14, textAlign: 'center', marginBottom: 16, color: '#9ca3af' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap' },
  actionButton: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center', marginHorizontal: 4, marginBottom: 8, minWidth: '40%' },
  refreshButton: { backgroundColor: '#f59e0b' },
  shareButton: { backgroundColor: '#10b981' },
  actionButtonText: { color: '#fff', fontWeight: '600', fontSize: 14, textAlign: 'center' },
});
