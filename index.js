var gameMatrix = [];
var chosenDifficulty = '';
var openedCells = 0;

function createButtons(difficulty) {
  document.getElementById('beginner').disabled = true;
  document.getElementById('intermediate').disabled = true;
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
        button.setAttribute('oncontextmenu', 'flagStatus(this.id)');
      }

      var br = document.createElement('br');
      boardStart.appendChild(br);
    }
  }

  placeMines(clickedButtonId);
  defineCells(clickedButtonId);
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
        for (var line = i - 1; line <= i + 1; ++line) {
          for (var column = j - 1; column <= j + 1; ++column) {
            if (line >= 0 && line < difficulty && column >= 0 && column < difficulty) {
              if (gameMatrix[line][column] === 'mine') {
                gameMatrix[i][j]++;
              }
            }
          }
        }
      }
    }
  }
}

function gameCheck(clickedId, difficulty) {

  var clickedCellId = parseInt(clickedId);
  if (document.getElementById(clickedCellId).disabled === false) {
    openedCells++;
  }

  var boardSize;
  var mines;
  if (chosenDifficulty === 'beginner') {
    boardSize = 9;
    mines = 11;
  } else {
    boardSize = 16;
    mines = 40;
  }

  if (openedCells === boardSize * boardSize - mines) {
    for (var i = 1; i <= boardSize * boardSize; ++i) {
      document.getElementById(i).disabled = true;
    }

    revealMines();
    alert('Game Won!');
  }

  var line = parseInt((clickedCellId - 1) / boardSize);
  var column = clickedCellId - line * boardSize - 1;

  if (gameMatrix[line][column] === 'mine') {
    revealMines(boardSize);
    for (var i = 1; i <= boardSize * boardSize; ++i) {
      document.getElementById(i).disabled = true;
    }

    alert('Game lost! Refresh to try again.');
  } else if (gameMatrix[line][column] !== 0) {
    document.getElementById(clickedCellId).innerHTML = gameMatrix[line][column];
    document.getElementById(clickedCellId).disabled = true;
    colorCell(line, column, boardSize);
  } else {
    document.getElementById(clickedCellId).disabled = true;
    gameMatrix[line][column] = '';
    for (var i = line - 1; i <= line + 1; ++i) {
      for (var j = column - 1; j <= column + 1; ++j) {
        if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
          if (gameMatrix[i][j] !== 0) {
            document.getElementById(boardSize * i + j + 1).innerHTML = gameMatrix[i][j];
            colorCell(i, j, boardSize);
          }

          if (document.getElementById(boardSize * i + j + 1).disabled === false) {
            openedCells++;
          }

          document.getElementById(boardSize * i + j + 1).disabled = true;
        }
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

function flagStatus(clickedCellId) {
  var boardSize;
  if (chosenDifficulty === 'beginner') {
    boardSize = 9;
  } else {
    boardSize = 16;
  }

  if (document.getElementById(clickedCellId).innerHTML === '') {
    document.getElementById(clickedCellId).innerHTML = '<i class="fas fa-flag"></i>';
  } else {
    if (document.getElementById(clickedCellId).innerHTML === '<i class="fas fa-flag" aria-hidden="true"></i>') {
      document.getElementById(clickedCellId).innerHTML = '';
    }
  }

  var line = parseInt((clickedCellId - 1) / boardSize);
  var column = clickedCellId - line * boardSize - 1;
}

function colorCell(line, column, boardSize) {
  var clickedCellId = boardSize * line + column + 1;
  if (gameMatrix[line][column] === 1) {
    document.getElementById(clickedCellId).style.color = 'blue';
  }

  if (gameMatrix[line][column] === 2) {
    document.getElementById(clickedCellId).style.color = '#108700';
  }

  if (gameMatrix[line][column] === 3) {
    document.getElementById(clickedCellId).style.color = 'red';
  }

  if (gameMatrix[line][column] === 4) {
    document.getElementById(clickedCellId).style.color = '#06005e';
  }

  if (gameMatrix[line][column] === 5) {
    document.getElementById(clickedCellId).style.color = '#913a00';
  }

  if (gameMatrix[line][column] === 6) {
    document.getElementById(clickedCellId).style.color = '#008a88';
  }

  if (gameMatrix[line][column] === 7) {
    document.getElementById(clickedCellId).style.color = 'black';
  }

  if (gameMatrix[line][column] === 8) {
    document.getElementById(clickedCellId).style.color = 'gray';
  }
}

