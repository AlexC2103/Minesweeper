var gameMatrix = [];
var boardSize = 0;
var mines = 0;
var openedCells = 0;

function createButtons(difficulty) {
  document.getElementById('beginner').disabled = true;
  document.getElementById('intermediate').disabled = true;
  var clickedButtonId;
  if (difficulty === 'beginner') {
    mines = 11;
    boardSize = 9;
  }

  if (difficulty === 'intermediate') {
    mines = 40;
    boardSize = 16;
  }

  var boardStart = document.getElementById('appendGame');

  for (var i = 0; i < boardSize; ++i) {
    gameMatrix[i] = [];
    for (var j = 0; j < boardSize; ++j) {
      gameMatrix[i][j] = 0;
    }
  }

  for (var i = 0; i < boardSize; ++i) {
    for (var j = 0; j < boardSize; ++j) {
      var button = document.createElement('BUTTON');
      var buttonId = i * boardSize + j + 1;
      boardStart.appendChild(button);
      button.setAttribute('class', 'boardButton');
      button.setAttribute('id', buttonId);
      button.setAttribute('onclick', 'gameCheck(this.id)');
      button.setAttribute('oncontextmenu', 'flagStatus(this.id)');
    }

    var br = document.createElement('br');
    boardStart.appendChild(br);
  }

  placeMines();
  defineCells(boardSize);
}

function placeMines() {
  for (var i = 1; i <= mines; ++i) {

    var randomLine = Math.floor(Math.random() * boardSize);
    var randomColumn = Math.floor(Math.random() * boardSize);

    if (gameMatrix[randomLine][randomColumn] === 0) {
      gameMatrix[randomLine][randomColumn] = 'mine';
    } else {
      while (gameMatrix[randomLine][randomColumn] !== 0) {
        randomLine = Math.floor(Math.random() * boardSize);
        randomColumn = Math.floor(Math.random() * boardSize);
      }

      gameMatrix[randomLine][randomColumn] = 'mine';
    }
  }
}

function defineCells() {
  for (var i = 0; i < boardSize; ++i) {
    for (var j = 0; j < boardSize; ++j) {

      if (gameMatrix[i][j] !== 'mine') {

        for (var line = i - 1; line <= i + 1; ++line) {
          for (var column = j - 1; column <= j + 1; ++column) {

            if (line >= 0 && line < boardSize && column >= 0 && column < boardSize) {
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

function gameCheck(clickedId) {

  var clickedCellId = parseInt(clickedId);
  if (document.getElementById(clickedCellId).disabled === false) {
    openedCells++;
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
    colorCell(clickedCellId);

  } else {

    document.getElementById(clickedCellId).disabled = true;
    gameMatrix[line][column] = '';

    for (var i = line - 1; i <= line + 1; ++i) {
      for (var j = column - 1; j <= column + 1; ++j) {
        if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
          if (gameMatrix[i][j] !== 0) {
            document.getElementById(boardSize * i + j + 1).innerHTML = gameMatrix[i][j];
            colorCell(boardSize * i + j + 1);
          }

          if (document.getElementById(boardSize * i + j + 1).disabled === false) {
            openedCells++;
          }

          document.getElementById(boardSize * i + j + 1).disabled = true;
        }
      }

      /// Recursion for opening a mine-free block
      if (column < boardSize - 1) {
        gameCheck((clickedCellId + 1).toString());
      }

      if (column > 0) {
        gameCheck((clickedCellId - 1).toString());
      }

      if (line > 0) {
        gameCheck((clickedCellId - boardSize).toString());
      }

      if (line < boardSize - 1) {
        gameCheck((clickedCellId + boardSize).toString());
      }
    }
  }
}

function revealMines() {
  for (var i = 0; i < boardSize; ++i) {
    for (var j = 0; j < boardSize; ++j) {
      if (gameMatrix[i][j] === 'mine') {
        document.getElementById(boardSize * i + j + 1).style.backgroundColor = 'red';
      }
    }
  }
}

function flagStatus(clickedCellId) {

  if (document.getElementById(clickedCellId).innerHTML === '') {
    document.getElementById(clickedCellId).innerHTML = '<i class="fas fa-flag"></i>';
  } else {
    if (document.getElementById(clickedCellId).innerHTML === '<i class="fas fa-flag" aria-hidden="true"></i>') {
      document.getElementById(clickedCellId).innerHTML = '';
    }
  }
}

function colorCell(clickedCellId) {

  var cellColors = ['', 'blue', '#108700', 'red', '#06005e', '#913a00', '#008a88', 'black', 'gray'];
  var line = parseInt((clickedCellId - 1) / boardSize);
  var column = clickedCellId - line * boardSize - 1;

  document.getElementById(clickedCellId).style.color = cellColors[gameMatrix[line][column]];
}
