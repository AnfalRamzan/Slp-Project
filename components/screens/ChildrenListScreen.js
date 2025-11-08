// components/screens/ChildrenListScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useChild } from '../context/ChildContext';

export default function ChildrenListScreen({ navigation }) {
  const { childrenList, setSelectedChild } = useChild();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChildren = childrenList.filter(child =>
    child.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.mrNumber.includes(searchQuery)
  );

  const handleChildPress = (child) => {
    setSelectedChild(child);
    navigation.navigate('ChildReport', { childId: child.id });
  };

  const getSuccessRate = (child) => {
    const totalSessions = child.sessions.length;
    if (totalSessions === 0) return 0;
    const passedSessions = child.sessions.filter(s => s.isPassed).length;
    return Math.round((passedSessions / totalSessions) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Children Records</Text>
      
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search children..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredChildren.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No children found' : 'No children added yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery ? 'Try a different search term' : 'Add children to see their reports here'}
          </Text>
        </View>
      ) : (
        filteredChildren.map((child) => (
          <TouchableOpacity
            key={child.id}
            style={styles.childCard}
            onPress={() => handleChildPress(child)}
          >
            <View style={styles.childHeader}>
              <Text style={styles.childName}>{child.childName}</Text>
              <Text style={styles.mrNumber}>MR: {child.mrNumber}</Text>
            </View>
            
            <View style={styles.childDetails}>
              <Text style={styles.detailText}>
                Sessions: {child.sessions.length}
              </Text>
              <Text style={styles.detailText}>
                Success Rate: {getSuccessRate(child)}%
              </Text>
              <Text style={styles.detailText}>
                Since: {new Date(child.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.viewReport}>
              <Text style={styles.viewReportText}>View Full Report →</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
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
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  childCard: {
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
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  mrNumber: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  childDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewReport: {
    alignItems: 'flex-end',
  },
  viewReportText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
});