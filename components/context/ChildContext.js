// components/context/ChildContext.js
import React, { createContext, useState, useContext } from 'react';
import { initialGoalBank } from '../data/goalBank';

const ChildContext = createContext();

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};

export const ChildProvider = ({ children }) => {
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  const addChild = (childData) => {
    const newChild = {
      id: Date.now().toString(),
      ...childData,
      createdAt: new Date().toISOString(),
      goalsProgress: {},
      sessions: []
    };
    
    // Initialize first goal for each category
    initialGoalBank.forEach(category => {
      if (category.unlocked) {
        const firstGoal = category.goals[0];
        if (firstGoal) {
          if (!newChild.goalsProgress[category.id]) {
            newChild.goalsProgress[category.id] = {};
          }
          newChild.goalsProgress[category.id][firstGoal.id] = {
            sessions: [],
            passed: false,
            unlocked: true
          };
        }
      }
    });
    
    setChildrenList(prev => [...prev, newChild]);
    return newChild;
  };

  const updateChildProgress = (childId, categoryId, goalId, sessionData) => {
    console.log('Updating child progress:', { childId, categoryId, goalId, sessionData });
    
    setChildrenList(prev => 
      prev.map(child => {
        if (child.id === childId) {
          // Create a deep copy of goalsProgress to avoid mutation issues
          const updatedGoalsProgress = JSON.parse(JSON.stringify(child.goalsProgress));
          
          // Ensure category exists
          if (!updatedGoalsProgress[categoryId]) {
            updatedGoalsProgress[categoryId] = {};
          }
          
          // Ensure goal exists and initialize if not
          if (!updatedGoalsProgress[categoryId][goalId]) {
            updatedGoalsProgress[categoryId][goalId] = {
              sessions: [],
              passed: false,
              unlocked: true
            };
          }

          const currentGoal = updatedGoalsProgress[categoryId][goalId];
          
          // Add the new session
          const newSessionRecord = {
            ...sessionData,
            id: Date.now().toString(),
            date: sessionData.sessionDate || new Date().toISOString()
          };
          
          // Update sessions for current goal
          currentGoal.sessions = [...currentGoal.sessions, newSessionRecord];
          
          // Check for 3 consecutive passed sessions
          const lastThreeSessions = currentGoal.sessions.slice(-3);
          const hasThreeConsecutivePasses = lastThreeSessions.length >= 3 && 
                                          lastThreeSessions.every(session => session.isPassed);
          
          console.log('Session check:', {
            totalSessions: currentGoal.sessions.length,
            lastThreeSessions: lastThreeSessions.length,
            allPassed: lastThreeSessions.every(s => s.isPassed),
            hasThreeConsecutivePasses
          });

          // Update goal passed status
          currentGoal.passed = hasThreeConsecutivePasses;

          // Unlock next goal if current goal is passed
          if (hasThreeConsecutivePasses) {
            const category = initialGoalBank.find(cat => cat.id === categoryId);
            if (category) {
              const currentGoalIndex = category.goals.findIndex(g => g.id === goalId);
              const nextGoal = category.goals[currentGoalIndex + 1];
              
              console.log('Goal completion check:', {
                currentGoalIndex,
                nextGoal: nextGoal?.id,
                totalGoals: category.goals.length
              });
              
              if (nextGoal) {
                // Initialize next goal if it doesn't exist
                if (!updatedGoalsProgress[categoryId][nextGoal.id]) {
                  updatedGoalsProgress[categoryId][nextGoal.id] = {
                    sessions: [],
                    passed: false,
                    unlocked: true
                  };
                } else {
                  // Ensure next goal is unlocked
                  updatedGoalsProgress[categoryId][nextGoal.id].unlocked = true;
                }
                
                console.log('Next goal unlocked:', nextGoal.id);
              } else {
                console.log('No next goal - this is the last goal in category');
              }
            }
          }

          // Update main sessions array
          const newMainSession = {
            id: Date.now().toString(),
            childId,
            categoryId,
            goalId,
            ...sessionData,
            date: sessionData.sessionDate || new Date().toISOString()
          };

          const updatedMainSessions = [...child.sessions, newMainSession];

          const updatedChild = {
            ...child,
            goalsProgress: updatedGoalsProgress,
            sessions: updatedMainSessions
          };

          console.log('Updated child progress:', {
            goalsProgress: updatedGoalsProgress[categoryId],
            sessionsCount: updatedMainSessions.length
          });

          return updatedChild;
        }
        return child;
      })
    );
  };

  const getChildProgress = (childId, categoryId) => {
    const child = childrenList.find(c => c.id === childId);
    return child?.goalsProgress[categoryId] || {};
  };

  const getUnlockedGoals = (childId, categoryId) => {
    const progress = getChildProgress(childId, categoryId);
    const unlockedGoals = Object.entries(progress)
      .filter(([goalId, goalData]) => goalData.unlocked)
      .map(([goalId, goalData]) => ({
        goalId,
        ...goalData
      }));
    
    console.log('Unlocked goals for', categoryId, ':', unlockedGoals);
    return unlockedGoals;
  };

  const getCurrentGoal = (childId, categoryId) => {
    const unlockedGoals = getUnlockedGoals(childId, categoryId);
    const currentGoal = unlockedGoals.find(goal => !goal.passed) || unlockedGoals[unlockedGoals.length - 1];
    
    console.log('Current goal for', categoryId, ':', currentGoal?.goalId);
    return currentGoal;
  };

  const getGoalSessionStatus = (childId, categoryId, goalId) => {
    const progress = getChildProgress(childId, categoryId);
    const goalData = progress[goalId];
    
    if (!goalData) return { consecutivePasses: 0, totalSessions: 0 };
    
    const sessions = goalData.sessions || [];
    const lastThree = sessions.slice(-3);
    const consecutivePasses = lastThree.filter(s => s.isPassed).length;
    
    return {
      consecutivePasses: goalData.passed ? 3 : consecutivePasses,
      totalSessions: sessions.length,
      passed: goalData.passed
    };
  };

  const getChildReport = (childId) => {
    const child = childrenList.find(c => c.id === childId);
    if (!child) return null;

    const totalSessions = child.sessions.length;
    const passedSessions = child.sessions.filter(s => s.isPassed).length;
    const successRate = totalSessions > 0 ? (passedSessions / totalSessions) * 100 : 0;

    // Group sessions by category
    const sessionsByCategory = child.sessions.reduce((acc, session) => {
      if (!acc[session.categoryId]) {
        acc[session.categoryId] = [];
      }
      acc[session.categoryId].push(session);
      return acc;
    }, {});

    // Calculate progress by category
    const categoryProgress = {};
    Object.keys(sessionsByCategory).forEach(categoryId => {
      const categorySessions = sessionsByCategory[categoryId];
      const passed = categorySessions.filter(s => s.isPassed).length;
      const total = categorySessions.length;
      categoryProgress[categoryId] = {
        passed,
        total,
        successRate: total > 0 ? Math.round((passed / total) * 100) : 0
      };
    });

    return {
      childInfo: child,
      totalSessions,
      passedSessions,
      successRate: Math.round(successRate),
      sessionsByCategory,
      categoryProgress,
      lastSession: child.sessions.length > 0 ? child.sessions[child.sessions.length - 1] : null,
      createdAt: child.createdAt
    };
  };

  const value = {
    childrenList,
    selectedChild,
    setSelectedChild,
    addChild,
    updateChildProgress,
    getChildProgress,
    getUnlockedGoals,
    getCurrentGoal,
    getGoalSessionStatus,
    getChildReport
  };

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
};