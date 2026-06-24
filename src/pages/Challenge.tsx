import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { BrainIcon, FootballIcon, CircuitIcon } from '../components/CategoryIcons';
import Logo from '../components/Logo';

type ChallengeState = 'category' | 'difficulty' | 'loading' | 'question' | 'correct' | 'wrong';

interface Category {
  id: string;
  name: string;
  description: string;
  xpEasy: string;
  xpMedium: string;
  xpHard: string;
  icon: React.FC<{ size?: number; color?: string }>;
  iconColor: string;
  hasHighestXP?: boolean;
}

interface Difficulty {
  id: string;
  name: string;
  xp: number;
  description: string;
  bgColor: string;
  borderColor: string;
}

const categories: Category[] = [
  {
    id: 'general',
    name: 'General Knowledge',
    description: 'Test your general knowledge across diverse topics',
    xpEasy: '10 XP',
    xpMedium: '20 XP',
    xpHard: '40 XP',
    icon: BrainIcon,
    iconColor: '#8B5CF6',
  },
  {
    id: 'football',
    name: 'Football',
    description: 'World Cup, leagues, players, records and history',
    xpEasy: '10 XP',
    xpMedium: '20 XP',
    xpHard: '40 XP',
    icon: FootballIcon,
    iconColor: '#38BDF8',
  },
  {
    id: 'ai',
    name: 'AI & Emerging Technology',
    description: 'AI, Machine Learning, Web3, Blockchain and the future',
    xpEasy: '15 XP',
    xpMedium: '30 XP',
    xpHard: '60 XP',
    icon: CircuitIcon,
    iconColor: '#10B981',
    hasHighestXP: true,
  },
];

const difficulties: Difficulty[] = [
  {
    id: 'easy',
    name: 'Easy',
    xp: 10,
    description: 'Great for warming up',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  {
    id: 'medium',
    name: 'Medium',
    xp: 20,
    description: 'Test your knowledge',
    bgColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: '#38BDF8',
  },
  {
    id: 'hard',
    name: 'Hard',
    xp: 40,
    description: 'For the experts',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8B5CF6',
  },
];

const mockQuestion = {
  text: 'What is the primary technology behind Bitcoin?',
  options: [
    'A. Centralized Database',
    'B. Blockchain',
    'C. Cloud Computing',
    'D. Artificial Intelligence',
  ],
  correctIndex: 1,
  explanation: 'Bitcoin uses blockchain technology, a decentralized ledger that records all transactions across a network of computers.',
};

const Challenge: React.FC = () => {
  const [state, setState] = useState<ChallengeState>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        setState('question');
        setTimeLeft(30);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'question' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (state === 'question' && timeLeft === 0) {
      handleSubmit();
    }
  }, [state, timeLeft]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setState('difficulty');
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    // Adjust XP based on category
    let adjustedXP = difficulty.xp;
    if (selectedCategory?.id === 'ai') {
      if (difficulty.id === 'easy') adjustedXP = 15;
      else if (difficulty.id === 'medium') adjustedXP = 30;
      else adjustedXP = 60;
    }
    setSelectedDifficulty({ ...difficulty, xp: adjustedXP });
    setState('loading');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (selectedAnswer === mockQuestion.correctIndex) {
        setState('correct');
      } else {
        setState('wrong');
      }
      setIsSubmitting(false);
    }, 500);
  };

  const handleBack = () => {
    if (state === 'difficulty') {
      setState('category');
      setSelectedCategory(null);
    } else if (state === 'question' || state === 'loading') {
      setState('difficulty');
      setSelectedAnswer(null);
      setTimeLeft(30);
    }
  };

  const handleNextChallenge = () => {
    setState('loading');
    setSelectedAnswer(null);
    setTimeLeft(30);
  };

  const handleGoToDashboard = () => {
    setState('category');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedAnswer(null);
  };

  // STATE 1: Category Selection
  const renderCategorySelection = () => (
    <div className="min-h-screen bg-bg-primary pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-text-primary text-center mb-4">
          Choose Your Challenge
        </h1>
        <p className="text-text-secondary text-center mb-10">
          Select a category to begin your knowledge test
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="relative group bg-card rounded-2xl p-6 lg:p-8 border-2 text-left transition-all duration-300 hover:scale-[1.02] hover:border-brand-purple/50"
              style={{
                borderColor: category.hasHighestXP
                  ? 'rgba(139, 92, 246, 0.5)'
                  : 'rgba(139, 92, 246, 0.3)',
              }}
            >
              {category.hasHighestXP && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gold rounded-full text-xs font-bold text-bg-primary">
                  HIGHEST XP
                </div>
              )}

              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.iconColor}20` }}
              >
                <category.icon size={28} color={category.iconColor} />
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2">
                {category.name}
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                {category.description}
              </p>
              <div className="text-xs text-text-secondary">
                Easy {category.xpEasy} | Medium {category.xpMedium} | Hard {category.xpHard}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // STATE 2: Difficulty Selection
  const renderDifficultySelection = () => (
    <div className="min-h-screen bg-bg-primary pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
          {selectedCategory?.name}
        </h2>
        <p className="text-text-secondary mb-10">Select your difficulty level</p>

        <div className="space-y-4">
          {difficulties.map((difficulty) => {
            let adjustedXP = difficulty.xp;
            if (selectedCategory?.id === 'ai') {
              if (difficulty.id === 'easy') adjustedXP = 15;
              else if (difficulty.id === 'medium') adjustedXP = 30;
              else adjustedXP = 60;
            }

            return (
              <button
                key={difficulty.id}
                onClick={() => handleDifficultySelect({ ...difficulty, xp: adjustedXP })}
                className="w-full p-5 rounded-xl text-left transition-all duration-200 hover:scale-[1.01]"
                style={{
                  backgroundColor: difficulty.bgColor,
                  border: `2px solid ${difficulty.borderColor}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-text-primary mb-1">
                      {difficulty.name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {difficulty.description}
                    </div>
                  </div>
                  <div className="text-xl font-bold" style={{ color: difficulty.borderColor }}>
                    +{adjustedXP} XP
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // STATE 3: Loading
  const renderLoading = () => (
    <div className="min-h-screen bg-bg-primary pt-20 pb-8 px-4 flex items-center justify-center">
      <div className="bg-card rounded-2xl p-10 text-center">
        <div className="mb-6 animate-spin">
          <Logo size={60} />
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Loader2 size={20} className="text-brand-purple animate-spin" />
          <span className="text-text-primary font-medium">AI is generating your question...</span>
        </div>
        <div className="h-2 w-48 bg-secondary-layer rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-brand rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );

  // STATE 4: Active Question
  const renderQuestion = () => {
    const progress = (timeLeft / 30) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="min-h-screen bg-bg-primary pt-20 pb-8 px-4">
        <div className="max-w-[680px] mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="px-3 py-1.5 bg-secondary-layer rounded-full text-sm font-medium text-text-primary">
              {selectedCategory?.name}
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `${selectedDifficulty?.borderColor}20`,
                color: selectedDifficulty?.borderColor,
              }}
            >
              {selectedDifficulty?.name?.toUpperCase()}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/20 rounded-full">
              <Star size={16} className="text-gold" fill="currentColor" />
              <span className="text-sm font-bold text-gold">+{selectedDifficulty?.xp} XP</span>
            </div>
          </div>

          {/* Timer and Question */}
          <div className="bg-card rounded-2xl p-6 lg:p-8">
            {/* Timer */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke="#273449"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke="#38BDF8"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-text-primary">{timeLeft}</span>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-lg lg:text-xl font-semibold text-text-primary text-center mb-8 leading-relaxed">
              {mockQuestion.text}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {mockQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4 ${
                    selectedAnswer === index
                      ? 'bg-interactive-cyan/10 border-2 border-interactive-cyan'
                      : 'bg-secondary-layer border-2 border-transparent hover:border-brand-purple'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedAnswer === index
                        ? 'bg-interactive-cyan text-bg-primary'
                        : 'bg-card text-text-secondary'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-text-primary">{option.slice(3)}</span>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || isSubmitting}
              className={`w-full mt-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                selectedAnswer === null
                  ? 'bg-secondary-layer cursor-not-allowed'
                  : 'bg-gradient-brand hover:scale-[1.01] hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Checking...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // STATE 5: Correct Result
  const renderCorrect = () => (
    <div className="min-h-screen bg-bg-primary pt-20 pb-8 px-4 flex items-center justify-center">
      <div className="max-w-[680px] w-full">
        <div className="bg-card rounded-2xl p-8 lg:p-10 text-center">
          {/* Checkmark Animation */}
          <div className="mb-6 animate-bounce">
            <CheckCircle size={80} className="text-success-emerald mx-auto" />
          </div>

          <h2 className="text-3xl font-bold text-success-emerald mb-2">Correct!</h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Star size={28} className="text-gold" fill="currentColor" />
            <span className="text-2xl font-bold text-gold animate-pulse">
              +{selectedDifficulty?.xp} XP Earned
            </span>
          </div>

          <div className="bg-success-emerald/10 rounded-xl p-4 mb-3">
            <div className="text-sm text-text-secondary mb-1">Correct Answer:</div>
            <div className="text-text-primary font-medium">
              {mockQuestion.options[mockQuestion.correctIndex].slice(3)}
            </div>
          </div>

          <p className="text-text-secondary text-sm mb-8">
            {mockQuestion.explanation}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleNextChallenge}
              className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-xl font-semibold transition-all"
            >
              Next Challenge
            </button>
            <button
              onClick={handleGoToDashboard}
              className="flex-1 py-3 border-2 border-secondary-layer hover:border-brand-purple text-text-primary rounded-xl font-semibold transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // STATE 6: Wrong Result
  const renderWrong = () => (
    <div className="min-h-screen bg-bg-primary pt-20 pb-8 px-4 flex items-center justify-center">
      <div className="max-w-[680px] w-full">
        <div className="bg-card rounded-2xl p-8 lg:p-10 text-center">
          {/* X Icon */}
          <div className="mb-6">
            <XCircle size={80} className="text-red-500 mx-auto" />
          </div>

          <h2 className="text-3xl font-bold text-red-500 mb-2">Not quite right</h2>

          <p className="text-text-secondary mb-6">No XP earned this time</p>

          <div className="bg-success-emerald/10 rounded-xl p-4 mb-3">
            <div className="text-sm text-text-secondary mb-1">Correct Answer:</div>
            <div className="text-text-primary font-medium">
              {mockQuestion.options[mockQuestion.correctIndex].slice(3)}
            </div>
          </div>

          <p className="text-text-secondary text-sm mb-8">
            {mockQuestion.explanation}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleNextChallenge}
              className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-xl font-semibold transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleGoToDashboard}
              className="flex-1 py-3 border-2 border-secondary-layer hover:border-brand-purple text-text-primary rounded-xl font-semibold transition-all"
            >
              Choose Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {state === 'category' && renderCategorySelection()}
      {state === 'difficulty' && renderDifficultySelection()}
      {state === 'loading' && renderLoading()}
      {state === 'question' && renderQuestion()}
      {state === 'correct' && renderCorrect()}
      {state === 'wrong' && renderWrong()}
    </>
  );
};

export default Challenge;
