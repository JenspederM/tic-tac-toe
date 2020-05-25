import React, { useState } from "react";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Game />
    </div>
  );
};

export default App;

const calculateWinner = (squares) => {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      };
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }

  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
};

const Square = ({ value, onClick, highlight }) => {
  const className = "square" + (highlight ? " highlight" : "");
  return (
    <button className={className} onClick={() => onClick()}>
      {value}
    </button>
  );
};

const Board = ({ squares, onClick, winLine }) => {
  const renderSquare = (i) => {
    const winLineVar = winLine;
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        highlight={winLineVar && winLineVar.includes(i)}
      />
    );
  };

  const boardSize = 3;
  let boardSquare = [];
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(renderSquare(i * boardSize + j));
    }
    boardSquare.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  return <div>{boardSquare}</div>;
};

const Game = () => {
  // State
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [stepNumber, setstepNumber] = useState(0);
  const [xIsNext, setxIsNext] = useState(true);
  const [isAscending, setIsAscensding] = useState(true);

  // Methods
  const handleClick = (i) => {
    const historyTmp = history.slice(0, stepNumber + 1);
    const currentHistory = historyTmp[historyTmp.length - 1];
    const squares = currentHistory.squares.slice();
    const winInfo = calculateWinner(squares);
    if (winInfo.winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(history.concat([{ squares: squares }]));
    setstepNumber(history.length);
    setxIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setHistory(history.slice(0, step + 1));
    setstepNumber(step);
    setxIsNext(step % 2 === 0);
  };

  const handleToggleSort = () => {
    setIsAscensding(!isAscending);
  };

  const restartGame = () => {
    setHistory([{ squares: Array(9).fill(null) }]);
    setstepNumber(0);
    setxIsNext(true);
  };

  // Render

  const current = history[stepNumber];
  const winInfo = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = "Go to move #" + move;
    if (move > 0) {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
    } else {
      return null;
    }
  });

  let status;
  if (winInfo.winner) {
    status = "Winner: " + winInfo.winner;
  } else {
    if (winInfo.isDraw) {
      status = "Draw";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <p>{status}</p>
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          winLine={winInfo.line}
        />
      </div>
      <div className="game-info">
        <p>
          <button onClick={() => restartGame()}>Restart Game</button>
          <button onClick={() => handleToggleSort()}>Sort Move History</button>
        </p>
        <p>Move History</p>
        <span>{stepNumber > 0 && <ol>{moves}</ol>}</span>
      </div>
    </div>
  );
};
