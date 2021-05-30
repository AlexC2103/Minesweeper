var gameMatrix = [];
var chosenDifficulty = '';
var discoveredMines = 0;
function createButtons(difficulty) {
  var clickedButtonId;
  if (difficulty === 'beginner') {
    chosenDifficulty = difficulty;
    clickedButtonId = 9;
  }

  if (difficulty === 'intermediate') {
    chosenDifficulty = difficulty;
    clickedButtonId = 16;
  }

  var boardStart = document.getElementById('appendGame');
  if (clickedButtonId !== 'hard') {
    for (var i = 0; i < parseInt(clickedButtonId); ++i) {
      gameMatrix[i] = [];
      for (var j = 0; j < parseInt(clickedButtonId); ++j) {
        gameMatrix[i][j] = 0;
      }
    }

    for (var i = 0; i < parseInt(clickedButtonId); ++i) {
      for (var j = 0; j < parseInt(clickedButtonId); ++j) {
        var button = document.createElement('BUTTON');
        var buttonId = i * parseInt(clickedButtonId) + j + 1;
        boardStart.appendChild(button);
        button.setAttribute('class', 'boardButton');
        button.setAttribute('id', buttonId);
        button.setAttribute('onclick', 'gameCheck(this.id)');
      }

      var br = document.createElement('br');
      boardStart.appendChild(br);
    }
  }

  placeMines(clickedButtonId);
  defineCells(clickedButtonId);
}

function gameCheck(clickedCellId) {
  console.log(parseInt(clickedCellId));
}

function placeMines(difficulty) {
  var boardSize = parseInt(difficulty);
  if (boardSize === 9) {
    for (var i = 1; i <= 11; ++i) {
      var randomLine = Math.floor(Math.random() * 7) + 1;
      var randomColumn = Math.floor(Math.random() * 7) + 1;
      if (gameMatrix[randomLine][randomColumn] === 0) {
        gameMatrix[randomLine][randomColumn] = 'mine';
      } else {
        while (gameMatrix[randomLine][randomColumn] !== 0) {
          randomLine = Math.floor(Math.random() * 9);
          randomColumn = Math.floor(Math.random() * 9);
        }

        gameMatrix[randomLine][randomColumn] = 'mine';
      }
    }
  } else if (boardSize === 16) {
    for (var i = 1; i <= 40; ++i) {
      var randomLine = Math.floor(Math.random() * 16);
      var randomColumn = Math.floor(Math.random() * 16);
      if (gameMatrix[randomLine][randomColumn] === 0) {
        gameMatrix[randomLine][randomColumn] = 'mine';
      } else {
        while (gameMatrix[randomLine][randomColumn] !== 0) {
          randomLine = Math.floor(Math.random() * 16);
          randomColumn = Math.floor(Math.random() * 16);
        }

        gameMatrix[randomLine][randomColumn] = 'mine';
      }
    }
  }
}

function defineCells(difficulty) {
  for (var i = 0; i < difficulty; ++i) {
    for (var j = 0; j < difficulty; ++j) {
      if (gameMatrix[i][j] !== 'mine') {
        //Upper cell line
        if ((i > 0) && gameMatrix[i - 1][j] === 'mine') {
          gameMatrix[i][j]++;
        }

        if ((i - 1 >= 0) && (j - 1 >= 0) && gameMatrix[i - 1][j - 1] === 'mine') {
          gameMatrix[i][j]++;
        }

        if ((i - 1 >= 0) && (j + 1 < difficulty) && gameMatrix[i - 1][j + 1] === 'mine') {
          gameMatrix[i][j]++;
        }

        //lower cell line
        if ((i + 1 < difficulty) && gameMatrix[i + 1][j] === 'mine') {
          gameMatrix[i][j]++;
        }

        if ((i + 1 < difficulty) && (j - 1 >= 0) && gameMatrix[i + 1][j - 1] === 'mine') {
          gameMatrix[i][j]++;
        }

        if ((i + 1 < difficulty) && (j + 1 < difficulty) && gameMatrix[i + 1][j + 1] === 'mine') {
          gameMatrix[i][j]++;
        }

        //Cell line
        if ((j - 1 >= 0) && gameMatrix[i][j - 1] === 'mine') {
          gameMatrix[i][j]++;
        }

        if ((j + 1 < difficulty) && gameMatrix[i][j + 1] === 'mine') {
          gameMatrix[i][j]++;
        }
      }
    }
  }
}

function gameCheck(clickedId, difficulty) {
  var clickedCellId = parseInt(clickedId);
  var boardSize;
  if (chosenDifficulty === 'beginner') {
    boardSize = 9;
  } else {
    boardSize = 16;
  }

  var line = parseInt((clickedCellId - 1) / boardSize);
  var column = clickedCellId - line * boardSize - 1;

  if (gameMatrix[line][column] === 'mine') {
    revealMines(boardSize);

  } else if (gameMatrix[line][column] !== 0) {
    document.getElementById(clickedCellId).innerHTML = gameMatrix[line][column];
  } else {

    document.getElementById(clickedCellId).disabled = true;
    gameMatrix[line][column] = 'null';

    //Revealing diagonals of the disabled/null cells
    if (line > 0 && column < boardSize - 1) {
      document.getElementById(clickedCellId - boardSize + 1).innerHTML = gameMatrix[line - 1][column + 1];
    }

    if (line > 0 && column > 0) {
      document.getElementById(clickedCellId - boardSize - 1).innerHTML = gameMatrix[line - 1][column - 1];
    }

    if (line < boardSize - 1 && column < boardSize - 1) {
      document.getElementById(clickedCellId + boardSize + 1).innerHTML = gameMatrix[line + 1][column + 1];
    }

    if (line < boardSize - 1 && column > 0) {
      document.getElementById(clickedCellId + boardSize - 1).innerHTML = gameMatrix[line + 1][column - 1];
    }

    /// Recursion for opening a mine-free block
    if (column < boardSize - 1) {
      gameCheck((clickedCellId + 1).toString(), difficulty);
    }

    if (column > 0) {
      gameCheck((clickedCellId - 1).toString(), difficulty);
    }

    if (line > 0) {
      gameCheck((clickedCellId - boardSize).toString(), difficulty);
    }

    if (line < boardSize - 1) {
      gameCheck((clickedCellId + boardSize).toString(), difficulty);
    }
  }
}

function revealMines(difficulty) {
  for (var i = 0; i < difficulty; ++i) {
    for (var j = 0; j < difficulty; ++j) {
      if (gameMatrix[i][j] === 'mine') {
        document.getElementById(difficulty * i + j + 1).style.backgroundColor = 'red';
      }
    }
  }
}
