// components/context/ChildContext.js
import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const addChild = (childData) => {
    const newChild = {
      id: Date.now().toString(),
      ...childData,
      createdAt: new Date().toISOString(),
      goalsProgress: {},
      sessions: []
    };

    // Initialize all goals for each category as unlocked
    initialGoalBank.forEach(category => {
      if (!newChild.goalsProgress[category.id]) {
        newChild.goalsProgress[category.id] = {};
      }
      category.goals.forEach(goal => {
        newChild.goalsProgress[category.id][goal.id] = {
          sessions: [],
          passed: false,
          unlocked: true, // 🔓 force all goals unlocked
        };
      });
    });

    setChildrenList(prev => [...prev, newChild]);
    return newChild;
  };

  const updateChildProgress = (childId, categoryId, goalId, sessionData) => {
    console.log('🔄 UPDATING CHILD PROGRESS:', { childId, categoryId, goalId, sessionData });

    setChildrenList(prev =>
      prev.map(child => {
        if (child.id !== childId) return child;

        const childCopy = JSON.parse(JSON.stringify(child));

        if (!childCopy.goalsProgress[categoryId]) {
          childCopy.goalsProgress[categoryId] = {};
        }
        if (!childCopy.goalsProgress[categoryId][goalId]) {
          childCopy.goalsProgress[categoryId][goalId] = {
            sessions: [],
            passed: false,
            unlocked: true,
          };
        }

        const currentGoal = childCopy.goalsProgress[categoryId][goalId];

        const newSession = {
          ...sessionData,
          id: Date.now().toString(),
          date: sessionData.sessionDate || new Date().toISOString(),
        };

        currentGoal.sessions.push(newSession);

        // Calculate consecutive passes
        let consecutivePasses = 0;
        for (let i = currentGoal.sessions.length - 1; i >= 0; i--) {
          if (currentGoal.sessions[i].isPassed) {
            consecutivePasses++;
          } else {
            break;
          }
        }

        const hasThreeConsecutive = consecutivePasses >= 3;
        currentGoal.passed = hasThreeConsecutive;

        // 🔓 Always keep all goals unlocked (no lock/next-goal logic)
        const category = initialGoalBank.find(cat => cat.id === categoryId);
        if (category) {
          category.goals.forEach(goal => {
            if (!childCopy.goalsProgress[categoryId][goal.id]) {
              childCopy.goalsProgress[categoryId][goal.id] = {
                sessions: [],
                passed: false,
                unlocked: true,
              };
            } else {
              childCopy.goalsProgress[categoryId][goal.id].unlocked = true;
            }
          });
        }

        // Save session globally
        childCopy.sessions.push({
          id: Date.now().toString(),
          childId,
          categoryId,
          goalId,
          ...sessionData,
          date: sessionData.sessionDate || new Date().toISOString(),
        });

        // Refresh UI
        setTimeout(() => {
          setRefreshTrigger(prev => prev + 1);
        }, 100);

        return childCopy;
      })
    );

    // Optional alert for success
    setTimeout(() => {
      if (sessionData.isPassed) {
        Alert.alert(
          "Session Passed 🎉",
          "Progress recorded successfully!"
        );
      }
    }, 200);
  };

  // helper for goal title
  const getGoalTitle = (goalId) => {
    for (const category of initialGoalBank) {
      const goal = category.goals.find(g => g.id === goalId);
      if (goal) return goal.title;
    }
    return goalId;
  };

  const getChildProgress = (childId, categoryId) => {
    const child = childrenList.find(c => c.id === childId);
    return child?.goalsProgress[categoryId] || {};
  };

  // 🔓 Force all goals unlocked permanently
  const getUnlockedGoals = (childId, categoryId) => {
    const category = initialGoalBank.find(cat => cat.id === categoryId);
    if (!category) return [];

    const unlockedGoals = category.goals.map(goal => ({
      goalId: goal.id,
      sessions: [],
      passed: false,
      unlocked: true,
    }));

    console.log('🔓 ALL GOALS UNLOCKED:', unlockedGoals.map(g => g.goalId));
    return unlockedGoals;
  };

  const getCurrentGoal = (childId, categoryId) => {
    const unlockedGoals = getUnlockedGoals(childId, categoryId);
    const currentGoal = unlockedGoals[0];
    console.log('🎯 CURRENT GOAL:', currentGoal?.goalId);
    return currentGoal;
  };

  const getGoalSessionStatus = (childId, categoryId, goalId) => {
    const progress = getChildProgress(childId, categoryId);
    const goalData = progress[goalId];

    if (!goalData) return { consecutivePasses: 0, totalSessions: 0, streakBroken: false };

    const sessions = goalData.sessions || [];

    let consecutivePasses = 0;
    let streakBroken = false;

    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].isPassed) consecutivePasses++;
      else {
        streakBroken = true;
        break;
      }
    }

    if (sessions.length > 0 && !sessions[sessions.length - 1].isPassed) {
      streakBroken = true;
      consecutivePasses = 0;
    }

    return {
      consecutivePasses: goalData.passed ? 3 : consecutivePasses,
      totalSessions: sessions.length,
      passed: goalData.passed,
      streakBroken: goalData.passed ? false : streakBroken && consecutivePasses === 0,
    };
  };

  const getChildReport = (childId) => {
    const child = childrenList.find(c => c.id === childId);
    if (!child) return null;

    const totalSessions = child.sessions.length;
    const passedSessions = child.sessions.filter(s => s.isPassed).length;
    const successRate = totalSessions > 0 ? (passedSessions / totalSessions) * 100 : 0;

    const sessionsByCategory = child.sessions.reduce((acc, session) => {
      if (!acc[session.categoryId]) acc[session.categoryId] = [];
      acc[session.categoryId].push(session);
      return acc;
    }, {});

    return {
      childInfo: child,
      totalSessions,
      passedSessions,
      successRate: Math.round(successRate),
      sessionsByCategory,
      lastSession: child.sessions[child.sessions.length - 1] || null,
      createdAt: child.createdAt,
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
    getChildReport,
    refreshTrigger,
  };

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
};
