import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import HomeButton from './HomeButton';
import '../styles/PlatformerGame.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_HEIGHT = 50;
const GRAVITY = 0.6;
const JUMP_FORCE = -15;
const SCROLL_SPEED = 3;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 60;

function PlatformerGame() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});

  const [player, setPlayer] = useState({
    x: 100,
    y: CANVAS_HEIGHT - GROUND_HEIGHT - 40,
    width: 30,
    height: 40,
    velocityY: 0,
    onGround: true
  });

  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [scrollX, setScrollX] = useState(0);

  // Generate obstacles
  const generateObstacle = useCallback(() => {
    const obstacle = {
      x: CANVAS_WIDTH + Math.random() * 300,
      y: CANVAS_HEIGHT - GROUND_HEIGHT - OBSTACLE_HEIGHT,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
      passed: false
    };
    return obstacle;
  }, []);

  // Check collision
  const checkCollision = useCallback((rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }, []);

  // Update game state
  const updateGame = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setPlayer((prevPlayer) => {
      let newPlayer = { ...prevPlayer };
      let newScrollX = scrollX;

      // Apply gravity
      newPlayer.velocityY += GRAVITY;
      newPlayer.y += newPlayer.velocityY;

      // Ground collision
      if (newPlayer.y + newPlayer.height >= CANVAS_HEIGHT - GROUND_HEIGHT) {
        newPlayer.y = CANVAS_HEIGHT - GROUND_HEIGHT - newPlayer.height;
        newPlayer.velocityY = 0;
        newPlayer.onGround = true;
      } else {
        newPlayer.onGround = false;
      }

      // Jump
      if (keysRef.current[' '] && newPlayer.onGround) {
        newPlayer.velocityY = JUMP_FORCE;
        newPlayer.onGround = false;
      }

      // Update scroll
      newScrollX += SCROLL_SPEED;
      setScrollX(newScrollX);

      return newPlayer;
    });

    // Update obstacles
    setObstacles((prevObstacles) => {
      let newObstacles = prevObstacles.map(obs => ({
        ...obs,
        x: obs.x - SCROLL_SPEED
      }));

      // Remove off-screen obstacles
      newObstacles = newObstacles.filter(obs => obs.x + obs.width > -50);

      // Add new obstacles
      if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < CANVAS_WIDTH - 200) {
        if (Math.random() < 0.02) { // 2% chance per frame
          newObstacles.push(generateObstacle());
        }
      }

      // Check collisions and scoring
      for (let obs of newObstacles) {
        if (checkCollision(player, obs)) {
          setGameOver(true);
          break;
        }

        // Score when passing obstacle
        if (!obs.passed && player.x > obs.x + obs.width) {
          obs.passed = true;
          setScore(prev => prev + 10);
        }
      }

      return newObstacles;
    });
  }, [gameOver, gameStarted, scrollX, player, checkCollision, generateObstacle]);

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Get theme-aware colors
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const bgColor = computedStyle.getPropertyValue('--card-bg').trim();
    const borderColor = computedStyle.getPropertyValue('--border-color').trim();

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

    // Draw player
    ctx.fillStyle = '#00d2d3';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    ctx.fillStyle = '#ff4757';
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
  }, [player, obstacles, score]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        keysRef.current[e.key] = true;
        if (!gameStarted && !gameOver) {
          setGameStarted(true);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        keysRef.current[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    gameLoopRef.current = setInterval(() => {
      updateGame();
    }, 1000 / 60); // 60 FPS

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameOver, gameStarted, updateGame]);

  // Draw loop
  useEffect(() => {
    const drawLoop = () => {
      draw();
      requestAnimationFrame(drawLoop);
    };
    drawLoop();
  }, [draw]);

  // Restart game
  const restartGame = () => {
    setPlayer({
      x: 100,
      y: CANVAS_HEIGHT - GROUND_HEIGHT - 40,
      width: 30,
      height: 40,
      velocityY: 0,
      onGround: true
    });
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setScrollX(0);
    keysRef.current = {};
  };

  return (
    <div className="platformer-game">
      <HamburgerMenu />
      <HomeButton />
      <div className="platformer-game-header">
        <div className="score">Score: {score}</div>
      </div>

      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="game-canvas"
        />

        {!gameStarted && !gameOver && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h2>🏃 Platformer</h2>
              <p>Press SPACEBAR to jump and avoid obstacles</p>
              <p className="instruction">Press SPACEBAR to start</p>
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
          <p>Press SPACEBAR to jump over obstacles</p>
          <p>Don't hit the red blocks!</p>
        </div>
      </div>
    </div>
  );
}

export default PlatformerGame;
