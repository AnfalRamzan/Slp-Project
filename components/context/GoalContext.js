// components/context/GoalContext.js
import React, { createContext, useState } from "react";
import { initialGoalBank } from "../data/goalBank";

export const GoalContext = createContext();

export function GoalProvider({ children }) {
  const [disorders, setDisorders] = useState(
    initialGoalBank.map((disorder) => ({
      ...disorder,
      unlocked: true, // 🔓 Disorder always unlocked
      goals: disorder.goals.map((goal) => ({
        ...goal,
        unlocked: true, // 🔓 Every goal unlocked
        passed: false,
        sessions: [],
      })),
    }))
  );

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  // ✅ Add session (progress tracking only, no locking)
  const addSession = (disorderId, goalId, sessionScore) => {
    setDisorders((prev) => {
      const next = clone(prev);
      const disorder = next.find((d) => d.id === disorderId);
      if (!disorder) return prev;

      const goal = disorder.goals.find((g) => g.id === goalId);
      if (!goal) return prev;

      goal.sessions.push({
        score: sessionScore,
        date: new Date().toISOString(),
      });

      // If last 3 ≥ 60, mark goal as passed
      const last3 = goal.sessions.slice(-3).map((s) => s.score);
      if (last3.length === 3 && last3.every((s) => s >= 60)) {
        goal.passed = true;
      }

      // ✅ Force unlock everything always
      disorder.unlocked = true;
      disorder.goals.forEach((g) => (g.unlocked = true));

      return next;
    });
  };

  const getDisorder = (id) => disorders.find((d) => d.id === id);

  return (
    <GoalContext.Provider
      value={{
        disorders,
        setDisorders,
        addSession,
        getDisorder,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}
