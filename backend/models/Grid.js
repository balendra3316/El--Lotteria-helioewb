
// models/Grid.js
const mongoose = require('mongoose');

const gridSchema = new mongoose.Schema({
  grid1: [[Number]],  
  grid2: [[Number]],  
  winner: {
    type: String,
    default: ''
  },
});

const Grid = mongoose.model('Grid', gridSchema);

module.exports = Grid;
