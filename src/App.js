import logo from './logo.svg';
import './App.css';

import { useState } from 'react';

// Squares for the game we add events for
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Main game thread
let plays = 0; // Used to check if game is draw

function Board({ xIsNext, squares, onPlay }) {
  // Event for square
  function handleClick(i) {
    plays++;

    // Return if the game is over
    if (calculateWinner(squares) || squares[i] || plays === 9) {
      return;
    }
    const nextSquares = squares.slice(); // Create copy of square

    // Check which player is next and use that to set the clicked square to that value
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Callback to update the game board
    onPlay(nextSquares);
  }

  // check if the winner is known after each play
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    // If all squares are used but no winner is found. Game is draw
    if (plays === 9) {
      status = 'Game Draw!';
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    
  }

  // Render the game board and add events for squares in html
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}


// Game component representing the overall game
export default function Game() {
  // State to manage the history of moves and the current move
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // check if is not even
  const currentSquares = history[currentMove];

  // Function to handle play and update game state
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); // Update history of plays
    setCurrentMove(nextHistory.length - 1); // set the current move to latest move
  }

  // Function to jump to a specific move in the game history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // Set the move to that history point
  }

  // Generate a list of moves with buttons to jump to each move
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    // Add events to buttons to return to history
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Render game board and history
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Function to determine the winner based on the current state of squares
function calculateWinner(squares) {
  // Array of possible winning combinations (rows, columns, and diagonals)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Loop through each winning combination
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // Destructuring the winning combination

    // Check if the squares at positions a, b, and c are equal and not null
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // If they are equal -> return the winner
    }
  }
  return null; // Return null if no winner was found
}