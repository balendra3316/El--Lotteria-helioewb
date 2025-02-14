import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [grid1, setGrid1] = useState(Array(3).fill(0).map(() => Array(3).fill('')));
  const [grid2, setGrid2] = useState(Array(3).fill(0).map(() => Array(3).fill('')));
  const [gameStarted, setGameStarted] = useState(false);
  const [randomNumber, setRandomNumber] = useState(null);
  const [winner, setWinner] = useState('');

  const isDuplicateInGrid = (grid, value) => {
    for (let row of grid) {
      if (row.includes(value)) return true;
    }
    return false;
  };

  const handleInput1 = (row, col, value) => {
    if ((value >= 1 && value <= 9) || value === '') {
      if (!isDuplicateInGrid(grid1, value)) {
        const newGrid1 = grid1.map((r, rowIndex) =>
          r.map((c, colIndex) => (rowIndex === row && colIndex === col ? value : c))
        );
        setGrid1(newGrid1);
      } else {
        alert('This number is already in the grid!');
      }
    }
  };

  const handleInput2 = (row, col, value) => {
    if ((value >= 1 && value <= 9) || value === '') {
      if (!isDuplicateInGrid(grid2, value)) {
        const newGrid2 = grid2.map((r, rowIndex) =>
          r.map((c, colIndex) => (rowIndex === row && colIndex === col ? value : c))
        );
        setGrid2(newGrid2);
      } else {
        alert('This number is already in the grid!');
      }
    }
  };

  const renderGrid = (grid, handleInput) => {
    return (
      <div className="d-flex flex-column">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="d-flex justify-content-center">
            {row.map((cell, colIndex) => (
              <div key={colIndex} className="p-2">
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[1-9]*"
                    value={cell !== null ? cell : ''}
                    onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                    className="form-control text-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      fontSize: '1.5rem',
                      padding: '10px',
                      border: '2px solid black',
                      textDecoration: cell === null ? 'line-through' : 'none',
                    }}
                  />
                  {cell === null && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      color: 'red',
                      fontSize: '1.5rem',
                    }}>
                      ✖
                    </div>
                  )}
                </div>
              </div>
            ))} 
          </div>
        ))}
      </div>
    );
  };

  const startGame = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/start-game', {
        grid1,
        grid2,
      });
      if (response.data) {
        setGameStarted(true);
        console.log('Game started:', response.data);
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const generateRandomNumber = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/generate-number');
      setRandomNumber(response.data.randomNumber);
      setGrid1(response.data.updatedGrid1);
      setGrid2(response.data.updatedGrid2);
      if (response.data.winner) {
        setWinner(response.data.winner);
        setGameStarted(false); // Stop the game when there's a winner
      }
    } catch (error) {
      console.error('Error generating number:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">El Lotteria Game</h1>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center">User 1</h2>
          {renderGrid(grid1, handleInput1)}
        </div>
        <div className="col-md-6">
          <h2 className="text-center">User 2</h2>
          {renderGrid(grid2, handleInput2)}
        </div>
      </div>
      <div className="text-center mt-4">
        {!winner && !gameStarted && (
          <div>
            <p>Please fill both boxes of User 1 and User 2 and <strong>click here</strong>:</p>
            <button className="btn btn-primary btn-sm" onClick={startGame}>
              Click Here
            </button>
          </div>
        )}
        {gameStarted && (
          <button className="btn btn-secondary ml-2" onClick={generateRandomNumber}>
            Generate Number
          </button>
        )}
        {winner && (
          <div>
            <h2 className="text-success mt-3">Winner: {winner}</h2>
            <button className="btn btn-danger mt-2" onClick={() => window.location.reload()}>End Game</button>
          </div>
        )}
      </div>
      {randomNumber && !winner && <h3 className="text-center mt-3">Generated Number: {randomNumber}</h3>}
    </div>
  );
}

export default App;
