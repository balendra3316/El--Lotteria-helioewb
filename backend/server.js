// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Grid = require('./models/Grid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://0.0.0.0/el-lotteria', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Error connecting to MongoDB:", err));


app.post('/api/start-game', async (req, res) => {
  const { grid1, grid2 } = req.body;
  const newGame = new Grid({ grid1, grid2 });
  await newGame.save();
  res.json({ message: 'Game started', game: newGame });
});


app.get('/api/generate-number', async (req, res) => {
  const game = await Grid.findOne().sort({ _id: -1 });  
  const allNumbers = [...new Set([...game.grid1.flat(), ...game.grid2.flat()])].filter(n => n);

 
  const randomNumber = allNumbers[Math.floor(Math.random() * allNumbers.length)];
  
  
  const updatedGrid1 = game.grid1.map(row => row.map(cell => (cell === randomNumber ? null : cell)));
  const updatedGrid2 = game.grid2.map(row => row.map(cell => (cell === randomNumber ? null : cell)));
  
  const checkWinner = (grid) => {
    const winningCombinations = [
      [grid[0][0], grid[0][1], grid[0][2]], // Row 1
      [grid[1][0], grid[1][1], grid[1][2]], // Row 2
      [grid[2][0], grid[2][1], grid[2][2]], // Row 3
      [grid[0][0], grid[1][0], grid[2][0]], // Col 1
      [grid[0][1], grid[1][1], grid[2][1]], // Col 2
      [grid[0][2], grid[1][2], grid[2][2]], // Col 3
    ];

    return winningCombinations.some(combination => combination.every(num => num === null));
  };

  let winner = '';
  if (checkWinner(updatedGrid1)) winner = 'User 1';
  if (checkWinner(updatedGrid2)) winner = 'User 2';

  
  game.grid1 = updatedGrid1;
  game.grid2 = updatedGrid2;
  game.winner = winner;
  await game.save();

  res.json({ randomNumber, updatedGrid1, updatedGrid2, winner });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
