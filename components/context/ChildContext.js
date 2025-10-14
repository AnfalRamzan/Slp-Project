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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

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
    console.log('🔄 UPDATING CHILD PROGRESS:', { childId, categoryId, goalId, sessionData });
    
    setChildrenList(prev => 
      prev.map(child => {
        if (child.id !== childId) return child;

        // Create deep copy
        const childCopy = JSON.parse(JSON.stringify(child));
        
        // Ensure structure exists
        if (!childCopy.goalsProgress[categoryId]) {
          childCopy.goalsProgress[categoryId] = {};
        }
        if (!childCopy.goalsProgress[categoryId][goalId]) {
          childCopy.goalsProgress[categoryId][goalId] = {
            sessions: [],
            passed: false,
            unlocked: true
          };
        }

        const currentGoal = childCopy.goalsProgress[categoryId][goalId];
        
        // Add new session
        const newSession = {
          ...sessionData,
          id: Date.now().toString(),
          date: sessionData.sessionDate || new Date().toISOString()
        };
        
        currentGoal.sessions.push(newSession);
        
        // Calculate consecutive passes from the END
        let consecutivePasses = 0;
        for (let i = currentGoal.sessions.length - 1; i >= 0; i--) {
          if (currentGoal.sessions[i].isPassed) {
            consecutivePasses++;
          } else {
            break;
          }
        }
        
        console.log('📊 Session Analysis:', {
          totalSessions: currentGoal.sessions.length,
          sessionResults: currentGoal.sessions.map(s => s.isPassed ? 'PASS' : 'FAIL'),
          consecutivePasses,
          needs3: consecutivePasses >= 3
        });

        const hasThreeConsecutive = consecutivePasses >= 3;
        const wasPreviouslyPassed = currentGoal.passed;
        
        currentGoal.passed = hasThreeConsecutive;

        let nextGoalUnlocked = false;
        
        // UNLOCK NEXT GOAL
        if (hasThreeConsecutive && !wasPreviouslyPassed) {
          const category = initialGoalBank.find(cat => cat.id === categoryId);
          if (category) {
            const currentIndex = category.goals.findIndex(g => g.id === goalId);
            const nextGoal = category.goals[currentIndex + 1];
            
            console.log('🎯 NEXT GOAL CHECK:', {
              currentGoal: goalId,
              currentIndex,
              nextGoal: nextGoal?.id,
              totalGoals: category.goals.length
            });

            if (nextGoal) {
              // Initialize next goal
              if (!childCopy.goalsProgress[categoryId][nextGoal.id]) {
                childCopy.goalsProgress[categoryId][nextGoal.id] = {
                  sessions: [],
                  passed: false,
                  unlocked: true
                };
              } else {
                childCopy.goalsProgress[categoryId][nextGoal.id].unlocked = true;
              }
              
              nextGoalUnlocked = true;
              console.log('✅ SUCCESS: Next goal unlocked!', nextGoal.id);
            }
          }
        }

        // Update main sessions
        childCopy.sessions.push({
          id: Date.now().toString(),
          childId,
          categoryId,
          goalId,
          ...sessionData,
          date: sessionData.sessionDate || new Date().toISOString()
        });

        console.log('✅ FINAL STATE:', {
          unlockedGoals: Object.keys(childCopy.goalsProgress[categoryId] || {}),
          currentGoalPassed: currentGoal.passed
        });

        // Force UI refresh after state update
        setTimeout(() => {
          setRefreshTrigger(prev => prev + 1);
        }, 100);

        return childCopy;
      })
    );

    // Show alert after state is updated
    setTimeout(() => {
      if (sessionData.isPassed) {
        const passCount = sessionData.passCount;
        if (passCount >= 3) {
          Alert.alert(
            "Session Passed! 🎉",
            `${passCount}/5 activities passed!\n\nCheck your goals list for progress.`
          );
        }
      }
    }, 200);
  };

  // Helper to get goal title
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

  const getUnlockedGoals = (childId, categoryId) => {
    const progress = getChildProgress(childId, categoryId);
    const unlockedGoals = Object.entries(progress)
      .filter(([goalId, goalData]) => goalData.unlocked)
      .map(([goalId, goalData]) => ({
        goalId,
        ...goalData
      }));

    console.log('🔓 UNLOCKED GOALS:', unlockedGoals.map(g => g.goalId));
    return unlockedGoals;
  };

  const getCurrentGoal = (childId, categoryId) => {
    const unlockedGoals = getUnlockedGoals(childId, categoryId);
    const currentGoal = unlockedGoals.find(goal => !goal.passed) || unlockedGoals[unlockedGoals.length - 1];
    
    console.log('🎯 CURRENT GOAL:', currentGoal?.goalId);
    return currentGoal;
  };

  const getGoalSessionStatus = (childId, categoryId, goalId) => {
    const progress = getChildProgress(childId, categoryId);
    const goalData = progress[goalId];
    
    if (!goalData) return { consecutivePasses: 0, totalSessions: 0, streakBroken: false };
    
    const sessions = goalData.sessions || [];
    
    // Calculate consecutive passes
    let consecutivePasses = 0;
    let streakBroken = false;
    
    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].isPassed) {
        consecutivePasses++;
      } else {
        streakBroken = true;
        break;
      }
    }
    
    // If last session failed, reset
    if (sessions.length > 0 && !sessions[sessions.length - 1].isPassed) {
      streakBroken = true;
      consecutivePasses = 0;
    }
    
    return {
      consecutivePasses: goalData.passed ? 3 : consecutivePasses,
      totalSessions: sessions.length,
      passed: goalData.passed,
      streakBroken: goalData.passed ? false : streakBroken && consecutivePasses === 0
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
    getChildReport,
    refreshTrigger // Export refresh trigger
  };

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
};