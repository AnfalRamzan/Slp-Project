// components/context/GoalContext.js
import React, { createContext, useState } from 'react';
import { initialGoalBank } from '../data/goalBank';

export const GoalContext = createContext();

export function GoalProvider({ children }) {
  const [disorders, setDisorders] = useState(initialGoalBank);

  // helper: deep clone
  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  // Add a session to a specific goal
  // sessionScore should be a number 0-100
  const addSession = (disorderId, goalId, sessionScore) => {
    setDisorders(prev => {
      const next = clone(prev);
      const dIndex = next.findIndex(d => d.id === disorderId);
      if (dIndex === -1) return prev;
      const goal = next[dIndex].goals.find(g => g.id === goalId);
      if (!goal || goal.passed) return prev; // don't change if already passed
      // push session to goal.sessions
      goal.sessions.push({ score: sessionScore, date: new Date().toISOString() });
      // after adding, check if last 3 sessions are >=60
      const last3 = goal.sessions.slice(-3).map(s => s.score);
      if (last3.length === 3 && last3.every(s => s >= 60)) {
        goal.passed = true;
      }
      // if all goals passed -> mark disorder completed and unlock next
      const allPassed = next[dIndex].goals.every(g => g.passed);
      if (allPassed && !next[dIndex].completed) {
        next[dIndex].completed = true;
        // unlock next disorder (if exists)
        if (dIndex + 1 < next.length) {
          next[dIndex + 1].unlocked = true;
        }
      }
      // if final disorder completed, nothing further here (Report screen can check)
      return next;
    });
  };

  // Check if all disorders are completed
  const allDisordersCompleted = () => {
    return disorders.every(d => d.completed);
  };

  // get disorder by id
  const getDisorder = (id) => disorders.find(d => d.id === id);

  return (
    <GoalContext.Provider value={{
      disorders,
      setDisorders,
      addSession,
      allDisordersCompleted,
      getDisorder
    }}>
      {children}
    </GoalContext.Provider>
  );
}
