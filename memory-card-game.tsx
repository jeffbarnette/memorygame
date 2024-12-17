import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Computer, 
  Database, 
  Cpu, 
  Terminal, 
  Braces,
  Code2,
  Volume2,
  VolumeX
} from 'lucide-react';

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [matchedLanguageInfo, setMatchedLanguageInfo] = useState(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [muted, setMuted] = useState(false);

  const LANGUAGE_CARDS = [
    { 
      id: 'python', 
      name: 'Python', 
      description: 'A versatile, high-level programming language known for readability and simplicity.',
      icon: <Code className="w-16 h-16 text-yellow-500" />,
      color: 'bg-yellow-100'
    },
    { 
      id: 'javascript', 
      name: 'JavaScript', 
      description: 'A dynamic language primarily used for web development and interactive websites.',
      icon: <Terminal className="w-16 h-16 text-yellow-600" />,
      color: 'bg-yellow-200'
    },
    { 
      id: 'rust', 
      name: 'Rust', 
      description: 'A systems programming language focused on safety, concurrency, and performance.',
      icon: <Cpu className="w-16 h-16 text-orange-500" />,
      color: 'bg-orange-100'
    },
    { 
      id: 'go', 
      name: 'Go', 
      description: 'A statically typed language developed by Google, known for simplicity and efficiency.',
      icon: <Database className="w-16 h-16 text-blue-500" />,
      color: 'bg-blue-100'
    },
    { 
      id: 'typescript', 
      name: 'TypeScript', 
      description: 'A typed superset of JavaScript that compiles to plain JavaScript.',
      icon: <Computer className="w-16 h-16 text-blue-600" />,
      color: 'bg-blue-200'
    },
    { 
      id: 'kotlin', 
      name: 'Kotlin', 
      description: 'A modern language that runs on the Java Virtual Machine with enhanced features.',
      icon: <Braces className="w-16 h-16 text-purple-500" />,
      color: 'bg-purple-100'
    },
  ];

  const playWinSound = useCallback(() => {
    if (!muted) {
      const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/24/audio_75314cc22a.mp3");
      audio.play();
    }
  }, [muted]);

  const toggleMute = () => {
    setMuted(!muted);
  };

  const initializeGame = () => {
    const duplicatedCards = [...LANGUAGE_CARDS, ...LANGUAGE_CARDS]
      .map((card, index) => ({ 
        ...card, 
        uniqueId: index,
        isFlipped: false,
        isMatched: false 
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(duplicatedCards);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setMoves(0);
    setScore(0);
    setGameStatus('playing');
    setMatchedLanguageInfo(null);
    setIsMessageVisible(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameStatus === 'won') {
      playWinSound();
    }
  }, [gameStatus, playWinSound]);

  const handleCardSelect = (selectedCard) => {
    if (
      gameStatus !== 'playing' ||
      selectedCard.isMatched || 
      selectedCards.some(card => card.uniqueId === selectedCard.uniqueId)
    ) {
      return;
    }

    const updatedCards = cards.map(card => 
      card.uniqueId === selectedCard.uniqueId 
        ? { ...card, isFlipped: true }
        : card
    );
    setCards(updatedCards);

    const newSelectedCards = [...selectedCards, selectedCard];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setMoves(moves + 1);

      if (newSelectedCards[0].id === newSelectedCards[1].id) {
        const matchedId = newSelectedCards[0].id;
        const matchedLanguage = LANGUAGE_CARDS.find(lang => lang.id === matchedId);
        
        const newScore = score + Math.max(20 - moves, 5);
        setScore(newScore);

        setMatchedLanguageInfo(matchedLanguage);
        setIsMessageVisible(true);

        const updatedCardsWithMatch = cards.map(card => 
          card.id === matchedId 
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        );
        setCards(updatedCardsWithMatch);
        
        const newMatchedPairs = new Set(matchedPairs);
        newMatchedPairs.add(matchedId);
        setMatchedPairs(newMatchedPairs);
        setSelectedCards([]);

        setTimeout(() => {
          setIsMessageVisible(false);
          setMatchedLanguageInfo(null);
          
          if (newMatchedPairs.size === LANGUAGE_CARDS.length) {
            setGameStatus('won');
          }
        }, 2000);
      } else {
        setTimeout(() => {
          const resetCards = cards.map(card => {
            if (
              card.uniqueId === newSelectedCards[0].uniqueId || 
              card.uniqueId === newSelectedCards[1].uniqueId
            ) {
              return { ...card, isFlipped: false };
            }
            return card;
          });
          setCards(resetCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 10 + 5;
        const rotation = Math.random() * 360;
        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 1;
        const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#8b5cf6'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              transform: `rotate(${rotation}deg)`,
              animation: `fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (gameStatus === 'won') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Confetti />
        <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md relative z-10">
          <h2 className="text-4xl font-bold text-green-600 mb-4">You Win!</h2>
          <p className="text-xl text-gray-700 mb-4">
            Congratulations on matching all programming language cards!
          </p>
          <div className="mb-4">
            <p className="text-lg text-gray-600">Total Moves: {moves}</p>
            <p className="text-lg text-blue-600">Final Score: {score}</p>
          </div>
          <Button 
            onClick={initializeGame} 
            className="bg-green-600 hover:bg-green-700 text-white text-xl px-8 py-3"
          >
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 bg-gray-50 relative">
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-white p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="flex items-center justify-between mb-4 px-4">
            <div className="flex items-center">
              <Code2 className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Memory Match
              </h1>
            </div>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={muted ? "Unmute sound" : "Mute sound"}
            >
              {muted ? (
                <VolumeX className="w-6 h-6 text-gray-500" />
              ) : (
                <Volume2 className="w-6 h-6 text-blue-600" />
              )}
            </button>
          </div>
          <p className="text-gray-600 text-center mb-4">Test your memory with programming languages!</p>
          <div className="flex justify-center items-center gap-8">
            <div className="bg-gray-50 px-4 py-2 rounded-full shadow-inner">
              <p className="text-lg text-gray-600">Moves: <span className="font-bold text-gray-800">{moves}</span></p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-full shadow-inner">
              <p className="text-lg text-blue-600">Score: <span className="font-bold text-blue-800">{score}</span></p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
              <div 
                key={card.uniqueId} 
                className={`
                  aspect-square rounded-xl flex items-center justify-center cursor-pointer
                  transition-all duration-300 ease-in-out
                  shadow-sm hover:shadow-md
                  ${card.isMatched 
                    ? 'opacity-0 pointer-events-none' 
                    : card.isFlipped 
                      ? `${card.color} scale-105` 
                      : 'bg-white hover:bg-gray-50'}
                  ${selectedCards.some(selected => selected.uniqueId === card.uniqueId) 
                    ? 'ring-4 ring-blue-500' 
                    : ''}
                `}
                onClick={() => handleCardSelect(card)}
              >
                {card.isFlipped 
                  ? card.icon 
                  : <span className="text-2xl font-bold text-gray-400">?</span>}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button 
              onClick={initializeGame} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg"
            >
              Reset Game
            </Button>
          </div>
        </div>
      </div>

      {/* Credits footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 py-2 px-4 text-center text-sm text-gray-600 border-t border-gray-200">
        Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=75314" className="text-blue-600 hover:text-blue-800">freesound_community</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=75314" className="text-blue-600 hover:text-blue-800">Pixabay</a>
      </div>

      {/* Match message */}
      <div 
        className={`
          fixed bottom-12 left-1/2 transform -translate-x-1/2 
          w-full max-w-2xl mx-auto px-4
          transition-all duration-500 ease-in-out
          ${isMessageVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8 pointer-events-none'}
        `}
      >
        {matchedLanguageInfo && (
          <div className="bg-green-100 rounded-xl shadow-lg p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-1">
                  {matchedLanguageInfo.name} Matched!
                </h2>
                <p className="text-green-700">{matchedLanguageInfo.description}</p>
              </div>
              {matchedLanguageInfo.icon && (
                <div className="ml-4 transform scale-75">
                  {matchedLanguageInfo.icon}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryGame;
