export const initialCategories = [
  {
    id: 1,
    name: "Receptive Language (F80.2)",
    unlocked: true,
    goals: [
      { id: "RL.01", name: "Localization", scores: [] },
      { id: "RL.02", name: "Joint attention", scores: [] },
      // ... rest of your goals
    ],
  },
  {
    id: 2,
    name: "Expressive Language (F80.1)",
    unlocked: false,
    goals: [
      { id: "EL.01", name: "Imitation", scores: [] },
      // ...
    ],
  },
  {
    id: 3,
    name: "Hearing Impairment (H90)",
    unlocked: false,
    goals: [
      { id: "HI.01", name: "Audition", scores: [] },
      // ...
    ],
  },
];
