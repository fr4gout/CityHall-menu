import type { TheoryQuestion } from "@/types";

export const mockDmvQuestions: TheoryQuestion[] = [
  {
    category: "EMERGENCY VEHICLES",
    question: "You must always yield to emergency vehicles using sirens or lights.",
    options: ["True", "False"],
    correctAnswer: 0,
  },
  {
    category: "SPEED LIMITS",
    question: "What is the maximum speed limit in a residential area unless posted otherwise?",
    options: ["25 mph", "35 mph", "45 mph", "55 mph"],
    correctAnswer: 0,
  },
  {
    category: "TRAFFIC SCENARIOS",
    question:
      "A police officer signals you to pull over while you are on a busy highway. What do you do?",
    options: [
      "Accelerate to find a fast exit",
      "Stop immediately in the driving lane",
      "Signal and pull over to the right shoulder safely",
      "Drive to the nearest police station",
    ],
    correctAnswer: 2,
  },
  {
    category: "ROAD RULES",
    question:
      "When approaching a four-way stop at the same time as another vehicle, who has the right of way?",
    options: [
      "The vehicle on the left",
      "The vehicle on the right",
      "The faster vehicle",
      "Whichever vehicle sounds their horn first",
    ],
    correctAnswer: 1,
  },
  {
    category: "ROAD SIGNS",
    question: "What action is required when approaching a red octagonal STOP sign?",
    options: [
      "Slow down and roll through if the road is clear",
      "Sound your horn and proceed",
      "Come to a complete stop behind the line",
      "Accelerate to clear the intersection quickly",
    ],
    correctAnswer: 2,
  },
  {
    category: "SAFETY",
    question: "It is legal to use a handheld phone while driving in a school zone.",
    options: ["True", "False"],
    correctAnswer: 1,
  },
  {
    category: "WEATHER CONDITIONS",
    question: "Hydroplaning is more likely to occur at higher speeds on wet roads.",
    options: ["True", "False"],
    correctAnswer: 0,
  },
  {
    category: "ALCOHOL LIMITS",
    question:
      "The legal blood alcohol concentration (BAC) limit for commercial drivers is lower than for passenger drivers.",
    options: ["True", "False"],
    correctAnswer: 0,
  },
];
