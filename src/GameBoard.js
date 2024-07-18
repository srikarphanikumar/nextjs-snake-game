import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];

const GameBoard = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);

    const generateFood = useCallback(() => {
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
        return newFood;
    }, []);

    const handleKeyDown = useCallback((e) => {
        e.preventDefault();
        switch (e.key) {
            case 'ArrowUp':
                setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
                break;
            case 'ArrowDown':
                setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
                break;
            case 'ArrowLeft':
                setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
                break;
            case 'ArrowRight':
                setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
                break;
            default:
                break;
        }
    }, []);

    const resetGame = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        setFood(generateFood());
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
    }, [generateFood]);

    useEffect(() => {
        const moveSnake = () => {
            if (gameOver) return;

            setSnake(prevSnake => {
                const newSnake = [...prevSnake];
                const head = { ...newSnake[0] };

                switch (direction) {
                    case 'UP':
                        head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
                        break;
                    case 'DOWN':
                        head.y = (head.y + 1) % GRID_SIZE;
                        break;
                    case 'LEFT':
                        head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
                        break;
                    case 'RIGHT':
                        head.x = (head.x + 1) % GRID_SIZE;
                        break;
                    default:
                        break;
                }

                newSnake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    setFood(generateFood());
                    setScore(prevScore => {
                        const newScore = prevScore + 1;
                        setHighestScore(prevHighest => Math.max(prevHighest, newScore));
                        return newScore;
                    });
                } else {
                    newSnake.pop();
                }

                // Check for collisions with itself
                for (let i = 1; i < newSnake.length; i++) {
                    if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
                        setGameOver(true);
                        return prevSnake;
                    }
                }

                return newSnake;
            });
        };

        const gameInterval = setInterval(moveSnake, 200);

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(gameInterval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [direction, food, gameOver, generateFood, handleKeyDown]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Snake Game</h1>
            <div
                className="border-4 border-gray-700 relative"
                style={{
                    width: `${GRID_SIZE * CELL_SIZE}px`,
                    height: `${GRID_SIZE * CELL_SIZE}px`,
                }}
            >
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        className="absolute bg-green-500"
                        style={{
                            left: `${segment.x * CELL_SIZE}px`,
                            top: `${segment.y * CELL_SIZE}px`,
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                        }}
                    />
                ))}
                <div
                    className="absolute bg-red-500"
                    style={{
                        left: `${food.x * CELL_SIZE}px`,
                        top: `${food.y * CELL_SIZE}px`,
                        width: `${CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                    }}
                />
                {gameOver && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center text-white text-2xl">
                        Game Over
                    </div>
                )}
            </div>
            <div className="mt-4 flex items-center space-x-4">
                <button
                    onClick={resetGame}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Reset
                </button>
                <span className="text-xl">Score: {score}</span>
                <span className="text-xl">Highest Score: {highestScore}</span>
            </div>
        </div>
    );
};

export default GameBoard;