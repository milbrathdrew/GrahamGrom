'use client';

import React, { useState } from 'react';
import JigsawPuzzle from './components/JigsawPuzzle';

export default function TreasureHuntApp() {
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState('puzzle');
  const [selectedImage, setSelectedImage] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);
  
  const secretCode = '7-1-18-1-7-5';
  const correctAnswer = 'GARAGE';
  
  const alphabet = {
    1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F',
    7: 'G', 8: 'H', 9: 'I', 10: 'J', 11: 'K', 12: 'L',
    13: 'M', 14: 'N', 15: 'O', 16: 'P', 17: 'Q', 18: 'R',
    19: 'S', 20: 'T', 21: 'U', 22: 'V', 23: 'W', 24: 'X',
    25: 'Y', 26: 'Z'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.toUpperCase() === correctAnswer) {
      setShowSuccess(true);
    } else {
      alert('Not quite! Try again! 🤔');
    }
  };

  const resetGame = () => {
    setUserInput('');
    setShowHint(false);
    setShowSuccess(false);
    setPuzzleCompleted(false);
    setCurrentPage('puzzle');
    setSelectedImage(null);
  };

  const handlePuzzleComplete = () => {
    setPuzzleCompleted(true);
    setCurrentPage('secret-agent');
  };

  // Get list of available puzzle images
  const getAvailableImages = () => {
    // Using puzzle1 through puzzle5 in /public/puzzle-images/ folder
    return [
      'puzzle1.jpg',
      'puzzle2.jpg', 
      'puzzle3.jpg',
      'puzzle4.jpg',
      'puzzle5.jpg'
    ];
  };

  // Select random image from available images
  const selectRandomImage = () => {
    const images = getAvailableImages();
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const selectedImagePath = `/puzzle-images/${images[randomIndex]}`;
      setSelectedImage(selectedImagePath);
      return selectedImagePath;
    }
    return null;
  };

  // Initialize with random image on component mount
  React.useEffect(() => {
    const images = getAvailableImages();
    setAvailableImages(images);
    selectRandomImage();
  }, []);

  // Puzzle Page
  if (currentPage === 'puzzle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2">🧩 BIRTHDAY PUZZLE QUEST! 🧩</h1>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {!selectedImage ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-purple-600 mb-4">🎯 Loading Your Puzzle...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">

                  
                  <div className="mt-4 p-4 bg-yellow-100 rounded-xl border-2 border-yellow-300">
                    <p className="text-lg font-semibold text-yellow-800">
                      🕵️‍♂️ Once you solve the puzzle, your secret agent mission will begin!
                    </p>
                  </div>
                </div>
                
                <JigsawPuzzle 
                  imageUrl={selectedImage}
                  onComplete={handlePuzzleComplete}
                  onReset={() => {
                    // Reset puzzle but keep the same image
                    setPuzzleCompleted(false);
                  }}
                />

              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">SUCCESS!</h1>
          <p className="text-xl text-gray-700 mb-6">
            You cracked the code! Your treasure is waiting in the {correctAnswer}! 🚗
          </p>
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-lg text-purple-600 font-semibold mb-6">
            Happy 5th Birthday! 🛻
          </p>
          <div className="space-y-3">
            <button 
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors mr-4"
            >
              🔄 Play Again
            </button>
            <button 
              onClick={() => setCurrentPage('puzzle')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              🧩 Back to Puzzle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🕵️‍♀️ SECRET AGENT CODE! 🕵️‍♂️</h1>
          <p className="text-xl text-white">Crack the code to find your birthday treasure!</p>
          {puzzleCompleted && (
            <div className="mt-4 p-3 bg-green-100 rounded-xl border-2 border-green-300 inline-block">
              <p className="text-green-800 font-semibold">✅ Puzzle Complete! Now solve the secret code!</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-center mb-3 text-indigo-600">📝 HOW TO PLAY</h3>
          <ol className="text-lg space-y-2 text-gray-700">
            <li><strong>1.</strong> Look at the secret code: <span className="font-mono font-bold text-red-600">{secretCode}</span></li>
            <li><strong>2.</strong> Use the decoder to find what letter each number represents</li>
            <li><strong>3.</strong> Put the letters together to spell a word</li>
            <li><strong>4.</strong> Type your answer and click "Check Answer"</li>
            <li><strong>5.</strong> Find your treasure in that special place! 🎁</li>
          </ol>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => setCurrentPage('puzzle')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors"
            >
              🧩 Back to Puzzle
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Secret Code Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-3xl font-bold text-center mb-4 text-purple-600">🔐 SECRET CODE</h2>
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-red-600 mb-4 p-4 bg-yellow-100 rounded-xl">
                {secretCode}
              </div>
              <p className="text-lg text-gray-600">Use the decoder below to solve this!</p>
            </div>
          </div>

          {/* Decoder Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-green-600">📚 SECRET DECODER</h2>
            <div className="grid grid-cols-6 gap-2 text-sm">
              {Object.entries(alphabet).map(([num, letter]) => (
                <div key={num} className="bg-blue-100 rounded p-2 text-center font-bold">
                  <div className="text-blue-800">{letter}</div>
                  <div className="text-blue-600 text-xs">{num}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">✏️ ENTER YOUR ANSWER</h2>
          
          <form onSubmit={handleSubmit} className="text-center">
            <div className="mb-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="What word does the code spell?"
                className="text-2xl font-bold text-center p-4 border-4 border-purple-300 rounded-xl w-full max-w-2xl uppercase tracking-widest"
                maxLength="10"
              />
            </div>
            
            <div className="space-y-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors"
              >
                🔍 CHECK ANSWER
              </button>
              
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors"
                >
                  💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>
              </div>
            </div>
          </form>

          {/* Hint Section */}
          {showHint && (
            <div className="mt-6 p-4 bg-yellow-100 rounded-xl border-4 border-yellow-300">
              <p className="text-xl text-center font-semibold text-yellow-800">
                🏠 This is where cars go to sleep at night! 🌙
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}