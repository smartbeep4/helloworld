import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../ui/HamburgerMenu';
import HomeButton from '../ui/HomeButton';
import '../../styles/SnakeGame.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

function SnakeGame() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchCurrentRef = useRef({ x: 0, y: 0 });
  const touchStartTimeRef = useRef(0);

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  // Check collision
  const checkCollision = useCallback((head, body) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    for (let segment of body) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setSnake((prevSnake) => {
      directionRef.current = nextDirectionRef.current;
      const head = { ...prevSnake[0] };
      
      // Move head
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // Check collision
      if (checkCollision(head, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, checkCollision, generateFood]);

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get theme-aware colors
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const bgColor = computedStyle.getPropertyValue('--card-bg').trim();
    const borderColor = computedStyle.getPropertyValue('--border-color').trim();
    
    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(food.x * CELL_SIZE + 1, food.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // Draw snake
    ctx.fillStyle = '#2ed573';
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#00d2d3';
      } else {
        ctx.fillStyle = '#2ed573';
      }
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });
  }, [snake, food]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      const key = e.key;
      const currentDir = directionRef.current;

      switch (key) {
        case 'ArrowUp':
          if (currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: -1 };
            if (!gameStarted) setGameStarted(true);
          }
          break;
        case 'ArrowDown':
          if (currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: 1 };
            if (!gameStarted) setGameStarted(true);
          }
          break;
        case 'ArrowLeft':
          if (currentDir.x === 0) {
            nextDirectionRef.current = { x: -1, y: 0 };
            if (!gameStarted) setGameStarted(true);
          }
          break;
        case 'ArrowRight':
          if (currentDir.x === 0) {
            nextDirectionRef.current = { x: 1, y: 0 };
            if (!gameStarted) setGameStarted(true);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, gameStarted]);

  // Handle touch input
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchStartRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      touchCurrentRef.current = { ...touchStartRef.current };
      touchStartTimeRef.current = Date.now();
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchCurrentRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();

      const touchDuration = Date.now() - touchStartTimeRef.current;
      const deltaX = touchCurrentRef.current.x - touchStartRef.current.x;
      const deltaY = touchCurrentRef.current.y - touchStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const currentDir = directionRef.current;

      // If significant movement (> 30px), treat as swipe
      if (distance > 30) {
        // Determine primary swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && currentDir.x === 0) {
            nextDirectionRef.current = { x: 1, y: 0 }; // Right
          } else if (deltaX < 0 && currentDir.x === 0) {
            nextDirectionRef.current = { x: -1, y: 0 }; // Left
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: 1 }; // Down
          } else if (deltaY < 0 && currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: -1 }; // Up
          }
        }
      } else if (touchDuration < 300) {
        // Short touch with little movement = tap
        // Calculate direction relative to snake head
        const head = snake[0];
        const headX = head.x * CELL_SIZE + CELL_SIZE / 2;
        const headY = head.y * CELL_SIZE + CELL_SIZE / 2;
        const tapX = touchStartRef.current.x;
        const tapY = touchStartRef.current.y;

        const deltaXFromHead = tapX - headX;
        const deltaYFromHead = tapY - headY;

        // Determine primary direction from tap position relative to head
        if (Math.abs(deltaXFromHead) > Math.abs(deltaYFromHead)) {
          // Tap is more horizontal relative to head
          if (deltaXFromHead > 0 && currentDir.x === 0) {
            nextDirectionRef.current = { x: 1, y: 0 }; // Right of head
          } else if (deltaXFromHead < 0 && currentDir.x === 0) {
            nextDirectionRef.current = { x: -1, y: 0 }; // Left of head
          }
        } else {
          // Tap is more vertical relative to head
          if (deltaYFromHead > 0 && currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: 1 }; // Below head
          } else if (deltaYFromHead < 0 && currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: -1 }; // Above head
          }
        }
      }

      // Start game if not started
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameOver, gameStarted, snake]);

  // Game loop effect
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    gameLoopRef.current = setInterval(() => {
      gameLoop();
    }, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameOver, gameStarted, gameLoop]);

  // Draw effect
  useEffect(() => {
    draw();
  }, [draw]);

  // Restart game
  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
  };

  return (
    <div className="snake-game">
      <HamburgerMenu onNavStateChange={setIsNavOpen} />
      <HomeButton isNavOpen={isNavOpen} />
      <div className="snake-game-header">
        <div className="score">Score: {score}</div>
      </div>

      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="game-canvas"
        />

        {!gameStarted && !gameOver && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h2>Snake Game</h2>
              <p>Use arrow keys to play</p>
              <p className="instruction">Press any arrow key to start</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>
              <button className="restart-button" onClick={restartGame}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="controls-info">
          <p>Use arrow keys to control the snake</p>
          <p>Eat the red food to grow and score points</p>
        </div>
      </div>
    </div>
  );
}

export default SnakeGame;

