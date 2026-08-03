import { StudyMaterial, Flashcard, QuizSet, StudyTask, StudyStats, User } from '../types';

export const INITIAL_USER: User = {
  id: 'user_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  college: 'Stanford University',
  major: 'Computer Science & Neuroscience',
  studyGoalHours: 25,
  streakDays: 7,
};

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_1',
    title: 'Neural Networks & Deep Learning Foundations.pdf',
    subject: 'Artificial Intelligence',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-08-01',
    pageCount: 14,
    readProgress: 78,
    tags: ['AI', 'Deep Learning', 'PyTorch', 'Backpropagation'],
    content: `Deep learning is a subfield of machine learning inspired by the structure and function of the human brain. Artificial neural networks (ANNs) consist of interconnected nodes (neurons) organized in layers: input layer, hidden layers, and output layer.

Key Components:
1. Perceptron & Activation Functions: Neurons process incoming weighted inputs and apply non-linear activation functions such as ReLU, Sigmoid, or Leaky ReLU to introduce non-linearity.
2. Forward Propagation: Calculates prediction output by passing input values through weights and biases across hidden layers.
3. Loss Function: Measures error between network prediction and target label (e.g. Mean Squared Error, Cross-Entropy Loss).
4. Backpropagation & Gradient Descent: Computes loss gradients with respect to weights using the chain rule, adjusting weights via optimizer algorithms like Adam or SGD.
5. Overfitting & Regularization: Techniques like Dropout, L2 regularization (weight decay), and Batch Normalization prevent networks from memorizing training noise.

Transformer Architectures & Self-Attention:
Introduced in 'Attention Is All You Need' (Vaswani et al., 2017), self-attention computes query-key-value projections allowing models to parallelize sequential text processing and capture long-range contextual relationships far better than recurrent models (RNNs/LSTMs).`,
    summary: 'Comprehensive guide covering artificial neural network architecture, forward and backward propagation, loss optimization algorithms, activation functions, regularization methods, and transformer self-attention mechanisms.',
    keyPoints: [
      'Activation functions (ReLU, GELU, Sigmoid) introduce non-linearity essential for complex function approximation.',
      'Backpropagation applies the calculus chain rule to calculate loss gradients backward from output layer to input layer.',
      'Adam optimizer combines Momentum and RMSProp adaptive learning rate mechanics.',
      'Transformers replace recurrent loops with Multi-Head Self-Attention for parallelized sequence processing.',
    ],
    concepts: [
      {
        term: 'Backpropagation',
        definition: 'Algorithm used in artificial neural networks to calculate gradients of the loss function with respect to weights.',
        simpleExplanation: 'Imagine hiking down a misty mountain backward. Backpropagation tells each neuron how much it contributed to taking a wrong step so it can adjust its step direction next time.'
      },
      {
        term: 'Self-Attention Mechanism',
        definition: 'A mathematical matrix computation that dynamically assigns importance weights to different words in a sequence regardless of distance.',
        simpleExplanation: 'Like looking at a sentence and drawing highlight strings between words that refer to each other—like connecting "it" back to "the dog" instantly.'
      }
    ],
    researchGaps: [
      'Interpretability of high-dimensional attention weights remains partially unresolved.',
      'High computational memory footprint during long-context KV caching in large transformer models.',
      'Catastrophic forgetting during continual domain fine-tuning without replay buffers.'
    ]
  },
  {
    id: 'mat_2',
    title: 'Cellular Respiration & ATP Synthesis.docx',
    subject: 'Biochemistry',
    fileType: 'docx',
    fileSize: '1.1 MB',
    uploadDate: '2026-07-29',
    pageCount: 8,
    readProgress: 100,
    tags: ['Biology', 'Metabolism', 'ATP', 'Mitochondria'],
    content: `Cellular respiration is the metabolic process by which cells extract chemical energy from nutrient molecules like glucose and convert it into Adenosine Triphosphate (ATP).

Four Main Stages:
1. Glycolysis (Cytosol): Glucose (6-carbon) is broken down into 2 Pyruvate molecules (3-carbon), yielding net 2 ATP and 2 NADH. Anaerobic process.
2. Pyruvate Oxidation (Mitochondrial Matrix): Pyruvate is converted into Acetyl-CoA, producing 1 NADH and releasing CO2 per pyruvate.
3. Citric Acid Cycle / Krebs Cycle (Mitochondrial Matrix): Acetyl-CoA combines with Oxaloacetate to form Citrate. Complete oxidation yields 2 ATP, 6 NADH, and 2 FADH2 per glucose molecule.
4. Oxidative Phosphorylation & Electron Transport Chain (Inner Mitochondrial Membrane): NADH and FADH2 donate electrons to protein complexes (Complex I-IV). Proton pumping builds a electrochemical gradient across the inner membrane. Chemiosmosis via ATP Synthase generates approximately 28-32 ATP molecules.`,
    summary: 'Overview of aerobic cellular respiration stages including Glycolysis, Pyruvate Decarboxylation, Krebs Cycle, and the Electron Transport Chain (ETC) driving ATP Synthase chemiosmosis.',
    keyPoints: [
      'Glycolysis occurs in the cytosol and does not require oxygen.',
      'Krebs cycle takes place in the mitochondrial matrix.',
      'Electron transport chain builds a proton gradient across the inner mitochondrial membrane.',
      'Oxygen acts as the final electron acceptor in aerobic respiration, forming water.'
    ],
    concepts: [
      {
        term: 'Chemiosmosis',
        definition: 'Movement of ions across a semipermeable membrane down their electrochemical gradient, used to synthesize ATP.',
        simpleExplanation: 'Think of water held behind a hydro dam. When allowed to flow through water turbines (ATP Synthase), the pressure turns the wheel to generate usable electricity (ATP).'
      }
    ],
    researchGaps: [
      'Efficiency variations in mitochondrial uncoupling proteins (UCP1) under extreme cold conditions.',
      'Mitochondrial metabolic shifts during cellular senescence and oncogenesis.'
    ]
  },
  {
    id: 'mat_3',
    title: 'Quantum Mechanics & Wave-Particle Duality.pptx',
    subject: 'Physics',
    fileType: 'pptx',
    fileSize: '4.8 MB',
    uploadDate: '2026-07-25',
    pageCount: 22,
    readProgress: 45,
    tags: ['Physics', 'Quantum', 'Schrödinger', 'Photon'],
    content: `Quantum mechanics governs the behavior of matter and light at atomic and subatomic scales.

Fundamental Principles:
1. Wave-Particle Duality: Light and microscopic particles exhibit properties of both waves and particles (e.g. Photoelectric Effect demonstrating photon light quanta, Double-Slit Experiment showing interference patterns of electrons).
2. De Broglie Wavelength: lambda = h / p (wavelength inversely proportional to momentum).
3. Heisenberg Uncertainty Principle: Deltax * Deltap >= hbar / 2. Impossible to simultaneously measure position and momentum with arbitrary precision.
4. Schrödinger Wave Equation: Describes quantum state wavefunctions psi(r,t). Probability density given by |psi|^2.`,
    summary: 'Introduction to quantum physics principles including wave-particle duality, Heisenberg uncertainty principle, de Broglie relation, and Schrödinger wavefunction probability densities.',
    keyPoints: [
      'Light exhibits photon particle behavior during photoelectric emission and wave behavior during diffraction.',
      'Heisenberg uncertainty limits simultaneous precision measurement of conjugate variable pairs.',
      'Quantum superposition states collapse to definite eigenvalues upon measurement.'
    ],
    concepts: [
      {
        term: 'Quantum Superposition',
        definition: 'Principle stating a physical system exists in a linear combination of all possible classical states until observed.',
        simpleExplanation: 'A spinning coin on a table is neither purely heads nor tails while spinning—it is in a combined state of both until you slam your hand down to observe it.'
      }
    ],
    researchGaps: [
      'Unification of general relativity gravity with quantum field theory (Quantum Gravity).',
      'Decoherence mitigation techniques for fault-tolerant quantum computing qubits.'
    ]
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_1',
    materialId: 'mat_1',
    subject: 'Artificial Intelligence',
    front: 'What is the mathematical purpose of Activation Functions in Neural Networks?',
    back: 'Activation functions (like ReLU, Sigmoid) introduce non-linear mapping capabilities, enabling neural networks to learn and approximate complex non-linear mathematical relationships.',
    hint: 'Think about linear vs non-linear transformations.',
    difficulty: 'easy',
    mastered: true,
    boxNumber: 4
  },
  {
    id: 'fc_2',
    materialId: 'mat_1',
    subject: 'Artificial Intelligence',
    front: 'Explain the chain rule application in Neural Network Backpropagation.',
    back: 'Backpropagation uses the calculus chain rule to calculate the partial derivatives of loss with respect to weight parameters by stepping backward from output layers to input layers.',
    hint: 'Calculus concept connecting nested function derivatives.',
    difficulty: 'medium',
    mastered: false,
    boxNumber: 2
  },
  {
    id: 'fc_3',
    materialId: 'mat_2',
    subject: 'Biochemistry',
    front: 'Where in the cell does Glycolysis take place, and what is its net ATP yield per glucose?',
    back: 'Glycolysis occurs in the cytosol (cytoplasm) and yields a net of 2 ATP and 2 NADH molecules per glucose molecule.',
    hint: 'Outside the mitochondria.',
    difficulty: 'easy',
    mastered: true,
    boxNumber: 5
  },
  {
    id: 'fc_4',
    materialId: 'mat_2',
    subject: 'Biochemistry',
    front: 'What role does Oxygen play in aerobic cellular respiration?',
    back: 'Oxygen serves as the final electron acceptor at the end of the Electron Transport Chain (Complex IV), combining with protons to form water (H2O).',
    hint: 'Final receiver in electron passing line.',
    difficulty: 'easy',
    mastered: true,
    boxNumber: 4
  },
  {
    id: 'fc_5',
    materialId: 'mat_3',
    subject: 'Physics',
    front: 'State Heisenberg\'s Uncertainty Principle formula and meaning.',
    back: 'Delta(x) * Delta(p) >= hbar / 2. It states that the position (x) and momentum (p) of a particle cannot be simultaneously known with absolute precision.',
    hint: 'Precision product bound.',
    difficulty: 'hard',
    mastered: false,
    boxNumber: 1
  }
];

export const INITIAL_QUIZZES: QuizSet[] = [
  {
    id: 'quiz_1',
    title: 'AI & Neural Networks Fundamentals Quiz',
    materialId: 'mat_1',
    subject: 'Artificial Intelligence',
    createdDate: '2026-08-02',
    lastScore: 85,
    attemptsCount: 3,
    questions: [
      {
        id: 'q1',
        question: 'Which component in a neural network introduces non-linearity allowing it to learn complex boundaries?',
        options: ['Bias vector', 'Activation function', 'Learning rate schedule', 'Batch normalization layer'],
        correctAnswer: 1,
        explanation: 'Without non-linear activation functions, stacked neural network layers would mathematically collapse into a single linear transformation.',
        topic: 'Neural Network Architecture'
      },
      {
        id: 'q2',
        question: 'What mathematical rule enables Backpropagation to calculate gradients across nested layers?',
        options: ['Bayes Theorem', 'L\'Hôpital\'s Rule', 'Calculus Chain Rule', 'Euler\'s Identity'],
        correctAnswer: 2,
        explanation: 'The chain rule computes dL/dW by multiplying local layer gradient derivatives sequentially from output back to input.',
        topic: 'Optimization'
      },
      {
        id: 'q3',
        question: 'What primary breakthrough allowed Transformer models to process sequences faster than RNNs?',
        options: ['Recurrent gating loops', 'Multi-Head Self-Attention', 'Convolutional pooling', 'Stochastic gradient descent'],
        correctAnswer: 1,
        explanation: 'Self-attention processes entire sequences simultaneously in matrix operations, removing the sequential bottleneck of RNN hidden state loops.',
        topic: 'Transformers'
      },
      {
        id: 'q4',
        question: 'What is the purpose of Dropout in deep learning training?',
        options: ['Speeding up matrix multiplication', 'Randomly deactivating neurons to prevent overfitting', 'Increasing learning rate automatically', 'Converting text to embeddings'],
        correctAnswer: 1,
        explanation: 'Dropout forces the network to learn redundant representations rather than co-adapting to specific training samples.',
        topic: 'Regularization'
      }
    ]
  },
  {
    id: 'quiz_2',
    title: 'Cellular Respiration & Metabolism Check',
    materialId: 'mat_2',
    subject: 'Biochemistry',
    createdDate: '2026-07-30',
    lastScore: 100,
    attemptsCount: 1,
    questions: [
      {
        id: 'q2_1',
        question: 'Which stage of cellular respiration produces the majority of ATP molecules?',
        options: ['Glycolysis', 'Citric Acid Cycle', 'Oxidative Phosphorylation', 'Pyruvate Oxidation'],
        correctAnswer: 2,
        explanation: 'Oxidative phosphorylation generates ~28-32 ATP via chemiosmosis driven by the proton gradient across the inner mitochondrial membrane.',
        topic: 'ATP Synthesis'
      },
      {
        id: 'q2_2',
        question: 'Where does the Citric Acid (Krebs) Cycle take place within eukaryotic cells?',
        options: ['Cytosol', 'Mitochondrial Matrix', 'Inner Mitochondrial Membrane', 'Nucleolus'],
        correctAnswer: 1,
        explanation: 'The Krebs cycle enzymes operate in the mitochondrial matrix fluid surrounding the inner membrane folds (cristae).',
        topic: 'Organelles'
      }
    ]
  }
];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task_1',
    title: 'Review Backpropagation & Calculus Derivatives',
    subject: 'Artificial Intelligence',
    dueDate: '2026-08-04',
    estimatedMinutes: 45,
    priority: 'high',
    completed: false,
    materialId: 'mat_1',
    aiSuggested: true
  },
  {
    id: 'task_2',
    title: 'Complete Biochemistry Flashcards Review (Leitner Box 1 & 2)',
    subject: 'Biochemistry',
    dueDate: '2026-08-03',
    estimatedMinutes: 20,
    priority: 'medium',
    completed: true,
    materialId: 'mat_2',
    aiSuggested: false
  },
  {
    id: 'task_3',
    title: 'Take Physics Practice Quiz on Wave-Particle Duality',
    subject: 'Physics',
    dueDate: '2026-08-05',
    estimatedMinutes: 30,
    priority: 'high',
    completed: false,
    materialId: 'mat_3',
    aiSuggested: true
  },
  {
    id: 'task_4',
    title: 'Read Chapter 4: Transformer Positional Encoding',
    subject: 'Artificial Intelligence',
    dueDate: '2026-08-06',
    estimatedMinutes: 60,
    priority: 'low',
    completed: false,
    aiSuggested: true
  }
];

export const INITIAL_STATS: StudyStats = {
  totalHoursStudied: 18.5,
  cardsMastered: 12,
  totalCards: 18,
  quizzesCompleted: 7,
  averageQuizScore: 92,
  activeStreak: 7,
  weeklyHours: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.2 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 1.5 },
  ],
  subjectProgress: [
    { subject: 'Artificial Intelligence', progress: 82, color: 'bg-purple-500' },
    { subject: 'Biochemistry', progress: 95, color: 'bg-emerald-500' },
    { subject: 'Physics', progress: 60, color: 'bg-amber-500' },
    { subject: 'Computer Science', progress: 75, color: 'bg-blue-500' },
  ]
};
