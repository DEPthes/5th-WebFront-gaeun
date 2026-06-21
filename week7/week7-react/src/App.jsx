import './index.css'
import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? 'winning' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  // 승자 확인
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.line : [];

  // 무승부 확인
  const isDraw = !winner && squares.every(square => square !== null);

  let status;
  if (winner) {
    status = '승자: ' + winner;
  } else if (isDraw) {
    status = '무승부!';
  } else {
    status = '다음 플레이어: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinning={winningSquares.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinning={winningSquares.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinning={winningSquares.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinning={winningSquares.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinning={winningSquares.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinning={winningSquares.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinning={winningSquares.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinning={winningSquares.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinning={winningSquares.includes(8)} />
      </div>
    </>
  );
}

// 전체 게임
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = move + '번째 수로 이동';
    } else {
      description = '게임 처음으로';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

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

// 승자 계산 함수
function calculateWinner(squares) {
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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}