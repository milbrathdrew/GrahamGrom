'use client';

import { useState, useRef, useEffect } from 'react';

const JigsawPuzzle = ({ imageUrl, onComplete, onReset }) => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [flashingGrid, setFlashingGrid] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Puzzle configuration
  const GRID_SIZE = 4; // 4x4 = 16 pieces
  const PIECE_SIZE = 80; // Smaller to fit better
  const GRID_OFFSET = 50; // Offset of grid from container edge
  const PIECES_AREA_WIDTH = 400;
  const PIECES_AREA_HEIGHT = 400;
  const PIECES_PER_ROW = 4;

  // Confetti component
  const Confetti = () => {
    const confettiPieces = Array.from({ length: 150 }, (_, i) => i);
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
    
    return (
      <>
        <style jsx global>{`
          @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
          }
          .confetti-piece {
            animation: confetti-fall 2s linear infinite;
          }
        `}</style>
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiPieces.map((i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 confetti-piece ${colors[Math.floor(Math.random() * colors.length)]}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      </>
    );
  };

  // Calculate position in pieces area (4x4 grid)
  const getPieceAreaPosition = (index) => {
    const row = Math.floor(index / PIECES_PER_ROW); // PIECES_PER_ROW = 4
    const col = index % PIECES_PER_ROW;
    return {
      x: col * (PIECE_SIZE + 10) + 10, // 10px padding between pieces
      y: row * (PIECE_SIZE + 10) + 10  // 10px padding between pieces
    };
  };

  // Handle piece selection
  const handlePieceClick = (piece) => {
    if (piece.isPlaced) return; // Don't allow selecting placed pieces
    setSelectedPiece(piece);
  };

  // Handle grid square click - simplified logic
  const handleGridClick = (row, col) => {
    if (!selectedPiece) return;

    // Check if this position is already occupied
    const isOccupied = pieces.some(p => p.isPlaced && p.row === row && p.col === col);
    if (isOccupied) return; // Can't place on occupied square

    const isCorrectPosition = selectedPiece.row === row && selectedPiece.col === col;

    if (isCorrectPosition) {
      // Correct placement - lock the piece in place
      const snapX = col * PIECE_SIZE;
      const snapY = row * PIECE_SIZE;

      setPieces(prev => prev.map(p => 
        p.id === selectedPiece.id 
          ? { 
              ...p, 
              currentX: snapX, 
              currentY: snapY, 
              isPlaced: true,
              placedCorrectly: true
            }
          : p
      ));

      // Check if puzzle is complete
      const updatedPieces = pieces.map(p => 
        p.id === selectedPiece.id 
          ? { ...p, placedCorrectly: true }
          : p
      );
      
      if (updatedPieces.every(p => p.placedCorrectly)) {
        setIsComplete(true);
        setShowConfetti(true);
        // Stop confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
        // Don't call onComplete automatically - let user choose via button
      }
    } else {
      // Incorrect placement - flash red and return to pieces area
      setFlashingGrid({ row, col });
      
      // Move piece back to pieces area
      const unplacedIndex = pieces.filter(p => !p.isPlaced).length;
      const areaPosition = getPieceAreaPosition(unplacedIndex);
      
      setPieces(prev => prev.map(p => 
        p.id === selectedPiece.id 
          ? { 
              ...p, 
              currentX: areaPosition.x, 
              currentY: areaPosition.y, 
              isPlaced: false,
              placedCorrectly: false
            }
          : p
      ));

      // Clear flash after animation
      setTimeout(() => setFlashingGrid(null), 500);
    }

    // Clear selection
    setSelectedPiece(null);
  };

  // Initialize puzzle pieces
  useEffect(() => {
    if (!imageUrl) return;

    const newPieces = [];
    
    // Create all pieces first
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const piece = {
          id: `${row}-${col}`,
          row,
          col,
          correctX: col * PIECE_SIZE,
          correctY: row * PIECE_SIZE,
          currentX: 0,
          currentY: 0,
          isPlaced: false,
          placedCorrectly: false
        };
        newPieces.push(piece);
      }
    }

    // Shuffle the pieces randomly
    const shuffledPieces = [...newPieces].sort(() => Math.random() - 0.5);

    // Assign randomized positions
    shuffledPieces.forEach((piece, index) => {
      const areaPosition = getPieceAreaPosition(index);
      piece.currentX = areaPosition.x;
      piece.currentY = areaPosition.y;
    });

    setPieces(shuffledPieces);
    setSelectedPiece(null);
    setIsComplete(false);
    setShowConfetti(false);
  }, [imageUrl]);

  // Reset puzzle function
  const resetPuzzle = () => {
    setIsComplete(false);
    setShowConfetti(false);
    setSelectedPiece(null);
    setFlashingGrid(null);
    
    // Reset all pieces to unplaced and randomize positions
    const resetPieces = pieces.map(piece => ({
      ...piece,
      isPlaced: false,
      placedCorrectly: false
    }));
    
    // Shuffle and reposition
    const shuffledPieces = [...resetPieces].sort(() => Math.random() - 0.5);
    shuffledPieces.forEach((piece, index) => {
      const areaPosition = getPieceAreaPosition(index);
      piece.currentX = areaPosition.x;
      piece.currentY = areaPosition.y;
    });
    
    setPieces(shuffledPieces);
  };

  // Auto-solve function (hidden debug feature)
  const autoSolve = () => {
    const solvedPieces = pieces.map(piece => ({
      ...piece,
      currentX: piece.correctX,
      currentY: piece.correctY,
      isPlaced: true,
      placedCorrectly: true
    }));
    
    setPieces(solvedPieces);
    setSelectedPiece(null);
    setIsComplete(true);
    setShowConfetti(true);
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {/* Confetti animation */}
      {showConfetti && <Confetti />}
      <div className="text-center mb-4">
        <p className="text-gray-600">Click a piece, then click the correct grid square!</p>
        <p className="text-sm text-gray-500 mt-1">
          {selectedPiece ? "Click the grid square where this piece belongs" : "Click a piece from the collection on the left"}
        </p>
        {/* Hidden auto-solve trigger */}
        <span 
          className="cursor-pointer hover:scale-110 transition-transform duration-200 inline-block text-xs opacity-20 hover:opacity-60"
          onClick={autoSolve}
          title="Auto-solve (debug)"
        >
          🧩
        </span>
      </div>

      {/* Side by side layout: Pieces area and Grid */}
      <div className="flex gap-8 items-start justify-center">
        
        {/* Left side: Puzzle pieces area OR completion message */}
        <div>
          {isComplete ? (
            // Completion message replaces puzzle pieces area
            <div className="bg-green-50 border-4 border-green-300 rounded-lg p-4 flex items-center justify-center" style={{ 
              width: PIECES_AREA_WIDTH,
              height: PIECES_AREA_HEIGHT
            }}>
              <div className="text-center w-full">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Puzzle Complete!</h3>
                <p className="text-sm text-gray-700 mb-4">Amazing work! You solved the puzzle!</p>
                
                <div className="space-y-2 flex flex-col items-center">
                  <button
                    onClick={onComplete}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors shadow-lg w-full max-w-xs"
                  >
                    🚀 Continue to Secret Mission
                  </button>
                  
                  <button
                    onClick={resetPuzzle}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors shadow-lg w-full max-w-xs"
                  >
                    🔄 Play Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Normal puzzle pieces area
            <>
              <h4 className="text-lg font-bold text-center text-gray-700 mb-3">Puzzle Pieces</h4>
              <div 
                className="relative bg-blue-50 border-4 border-blue-300 rounded-lg"
                style={{ 
                  width: PIECES_AREA_WIDTH,
                  height: PIECES_AREA_HEIGHT
                }}
              >
                {/* Unplaced pieces */}
                {pieces.filter(piece => !piece.isPlaced).map((piece) => (
                  <div
                    key={piece.id}
                    className={`absolute cursor-pointer transition-all duration-200 border-4 rounded-lg overflow-hidden ${
                      selectedPiece?.id === piece.id
                        ? 'shadow-xl transform scale-110 border-blue-500 border-8'
                        : 'shadow-lg hover:shadow-xl transform hover:scale-105 border-purple-500'
                    }`}
                    style={{
                      left: piece.currentX,
                      top: piece.currentY,
                      width: PIECE_SIZE,
                      height: PIECE_SIZE,
                      zIndex: selectedPiece?.id === piece.id ? 1000 : 10,
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: `${GRID_SIZE * PIECE_SIZE}px ${GRID_SIZE * PIECE_SIZE}px`,
                      backgroundPosition: `-${piece.col * PIECE_SIZE}px -${piece.row * PIECE_SIZE}px`,
                      backgroundRepeat: 'no-repeat'
                    }}
                    onClick={() => handlePieceClick(piece)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right side: Main puzzle grid */}
        <div>
          <h4 className="text-lg font-bold text-center text-gray-700 mb-3">Puzzle Grid</h4>
          <div 
            className="relative bg-gray-100 border-4 border-purple-300 rounded-lg"
            style={{ 
              width: GRID_SIZE * PIECE_SIZE + 100,
              height: GRID_SIZE * PIECE_SIZE + 100
            }}
          >
        {/* Background grid */}
        <div 
          className="absolute border-2 border-dashed border-gray-300 bg-white/50"
          style={{
            left: GRID_OFFSET,
            top: GRID_OFFSET,
            width: GRID_SIZE * PIECE_SIZE,
            height: GRID_SIZE * PIECE_SIZE
          }}
        >
          {/* Grid cells - clickable to place selected piece */}
          {Array.from({ length: GRID_SIZE }).map((_, row) =>
            Array.from({ length: GRID_SIZE }).map((_, col) => {
              const isOccupied = pieces.some(p => p.isPlaced && p.row === row && p.col === col);
              const isFlashing = flashingGrid && flashingGrid.row === row && flashingGrid.col === col;
              
              return (
                <div
                  key={`cell-${row}-${col}`}
                  className={`absolute border-2 border-gray-300 transition-all duration-200 ${
                    isFlashing
                      ? 'bg-red-400 border-red-600 animate-pulse'
                      : isOccupied
                      ? 'bg-green-100 cursor-default'
                      : selectedPiece
                      ? 'cursor-pointer hover:bg-gray-200'
                      : 'cursor-default'
                  }`}
                  style={{
                    left: col * PIECE_SIZE,
                    top: row * PIECE_SIZE,
                    width: PIECE_SIZE,
                    height: PIECE_SIZE
                  }}
                  onClick={() => handleGridClick(row, col)}
                />
              );
            })
          )}
          
          {/* Grid lines */}
          {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
            <div key={`line-${i}`}>
              <div 
                className="absolute border-l border-gray-400"
                style={{
                  left: i * PIECE_SIZE,
                  top: 0,
                  height: GRID_SIZE * PIECE_SIZE
                }}
              />
              <div 
                className="absolute border-t border-gray-400"
                style={{
                  left: 0,
                  top: i * PIECE_SIZE,
                  width: GRID_SIZE * PIECE_SIZE
                }}
              />
            </div>
          ))}
        </div>

        {/* Only show placed pieces in grid area */}
        {pieces.filter(piece => piece.isPlaced).map((piece) => (
          <div
            key={piece.id}
            className="absolute border-4 rounded-lg overflow-hidden border-green-500 shadow-none cursor-default"
            style={{
              left: piece.currentX + GRID_OFFSET,
              top: piece.currentY + GRID_OFFSET,
              width: PIECE_SIZE,
              height: PIECE_SIZE,
              zIndex: 1,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${GRID_SIZE * PIECE_SIZE}px ${GRID_SIZE * PIECE_SIZE}px`,
              backgroundPosition: `-${piece.col * PIECE_SIZE}px -${piece.row * PIECE_SIZE}px`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}

          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="text-sm text-gray-500">
          Correctly placed: {pieces.filter(p => p.placedCorrectly).length} / {pieces.length}
        </div>
        {selectedPiece && (
          <button
            onClick={() => setSelectedPiece(null)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
          >
            Cancel Selection
          </button>
        )}
      </div>
    </div>
  );
};

export default JigsawPuzzle;