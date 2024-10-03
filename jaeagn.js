const canvas = document.getElementById("chessboard");
const ctx = canvas.getContext("2d");
const squareSize = canvas.width / 9;
const pieceSize = squareSize * 0.8;
const worker = new Worker('worker.js');
let cw = Math.random() > 0.5;
let cb = Math.random() > 0.5;
let wp = cw ? "computer" : "human";
let bp = cb ? "computer" : "human";
document.getElementById("players").innerHTML = `${wp} - ${bp}`;
let gstart;
let stm = 0;
let searchDepth = 5;
start();
const newGameButton = document.getElementById("newGameButton");
const newGameDialog = document.getElementById("newGameDialog");
const startButton = document.getElementById("startButton");
const cancelButton = document.getElementById("cancelButton");

function newGame() }
  newGameDialog.classList.remove("hidden");
}

function start() {
  // Get selected values
  const whitePlayer = document.getElementById("whitePlayer").value;
  const blackPlayer = document.getElementById("blackPlayer").value;
  const difficulty = document.getElementById("difficulty").value;

  // Start the game with the selected settings
  // ... (your game logic here
  wp = whitePlayer;
  bp = blackPlayer;
  cw = wp === 'computer';
  cb = bp === 'computer';
  searchDepth = difficulty === 'easy' ? 5 : (difficulty === 'medium' ? 6 : 7);

  // Close the dialog
  newGameDialog.classList.add("hidden");
};

cancelButton.addEventListener("click", () => {
  newGameDialog.classList.add("hidden");
});

function drawBoard() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? "#aaffff":"#aaffaa";
      ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      if (i === 7) {
        ctx.font = "17px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "magenta";
        ctx.fillText(String.fromCharCode(97 + j), j * squareSize + squareSize / 2, canvas.width - squareSize / 2);
      }
      if (j === 0) {
        ctx.font = "17px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "magenta";
        ctx.fillText(8 - i, canvas.width - squareSize / 2, i * squareSize + squareSize / 2);
      }
    }
  }
}

function drawPieces(board14) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board14.board[i][j];
      if (piece[0] !== "") {
        const x = j * squareSize + squareSize / 2 - pieceSize / 2;
        const y = (7 - i) * squareSize + squareSize / 2 - pieceSize / 2;
        ctx.font = `${pieceSize}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = piece[1] === "white" ? "#aaaaff" : "#ffaaaa";
        ctx.fillText(
          toUnicodePiece(piece[0]),
          x + pieceSize / 2,
          y + pieceSize / 2
        );
      }
    }
  }
}

function toUnicodePiece(piece1) {
  switch (piece1) {
    case 'K': return String.fromCharCode(0x265A);
    case 'Q': return String.fromCharCode(0x265B);
    case 'R': return String.fromCharCode(0x265C);
    case 'B': return String.fromCharCode(0x265D);
    case 'N': return String.fromCharCode(0x265E);
    case 'P': return String.fromCharCode(0x265F);
    default: return " ";
  }
}

function drawChessboard(board13) {
  drawBoard();
  drawPieces(board13);
}

function createTable(jsonString) {
  // Parse the JSON string into a JavaScript object
  const jsonData = JSON.parse(jsonString);

  // Get the table element
  const table = document.createElement("table");

  // Create the header row
  const headerRow = table.insertRow();

  // Get the field names from the first object
  const fields = Object.keys(jsonData[0]);

  // Create header cells
  fields.forEach((field) => {
    const th = document.createElement("th");
    th.textContent = field;
    headerRow.appendChild(th);
  });

  // Create table rows and cells
  jsonData.forEach((row) => {
    const newRow = table.insertRow();
    fields.forEach((field) => {
      const cell = newRow.insertCell();
      cell.textContent = row[field];
    });
  });

  return table;
}

const board = transpose(
  JSON.parse(
    '{"board":[[["R", "black"], ["N", "black"], ["B", "black"], ["Q", "black"], ["K", "black"], ["B", "black"], ["N", "black"], ["R", "black"]], [["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"]], [["R", "white"], ["N", "white"], ["B", "white"], ["Q", "white"], ["K", "white"], ["B", "white"], ["N", "white"], ["R", "white"]]]}'
  )
);
drawChessboard(board);
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const squareSize = canvas.width / 9;
  const i3 = 7 - Math.floor(y / squareSize);
  const j3 = Math.floor(x / squareSize);
  if (!stm && !cw || stm && !cb)
    handleClick(i3, j3);
});

const output = document.getElementById("output");
let display = [];

function removeFirstChild(element) {
  if (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function updateTable(display) {
  const table = createTable(JSON.stringify(display));
  output.appendChild(table);
}

function tr2(rank) {
  const result = [];
  rank.forEach((sq) => {
    let sq2;
    if (sq[1] === "white") sq2 = [sq[0], "black"];
    else if (sq[1] === "black") sq2 = [sq[0], "white"];
    else sq2 = sq;
    result.push(sq2);
  });
  return result;
}

function transpose(board7) {
  const result = {
    board: []
  };
  for (let i = 8; i > 0; i--) result.board.push(tr2(board7.board[i - 1]));
  return result;
}

function makemove(board3, move2) {
  let board5 = JSON.parse(JSON.stringify(board3));
  if (board5.board[move2[0]][move2[1]][0] === "K")
    if (Math.abs(move2[1] - move2[3]) === 2) {
      board5.board[0][7 * (move2[3] === 6)] = ["", ""];
      const piece2 = ["R", "black"];
      board5.board[0][4 + 1 - 2 * (move2[3] == 2)] = piece2;
    }
  board5.board[move2[2]][move2[3]] = board5.board[move2[0]][move2[1]];
  board5.board[move2[0]][move2[1]] = ["", ""];
  const board9 = transpose(board5);
  return board9;
}

function addMove(movelist1, move2) {
  movelist1.push(move2);
}

function move(x0, x1, y0, y1, prom = 0) {
  return [x0, x1, y0, y1];
}

let sqs = 0;
let i7;
let j7;
start = board;
gstart = start;
drawChessboard(start);

function updateMode() {
  cw = cwel.value;
  cb = cbel.value;
}

if (!stm && cw || stm && cb)
  worker.postMessage({ start: JSON.stringify({gstart, stm, searchDepth}) });

function handleClick(i3, j3) {
  if (!sqs) {
    i7 = i3;
    j7 = j3;
  } else {
    let move24;
    if (stm) {
      i7 = 7 - i7;
      i3 = 7 - i3;
    }
    move24 = move(i7, j7, i3, j3);
    if (stm)
      start = transpose(start);
    start = makemove(start, move24);
    if (!stm)
      start = transpose(start);
    drawChessboard(start);
    if (!stm)
      start = transpose(start);
    gstart = start;
    if (!stm)
      start = transpose(start);
    stm ^= 1;
    if (!stm && cw || stm && cb)
      worker.postMessage({ start: JSON.stringify({gstart, stm, searchDepth}) });
  }
  sqs ^= 1;
}

// main.js
stm = 0;
worker.onmessage = (event) => {
  const msg73 = event.data.variations;

  // Clear the output element before adding the new table
  output.innerHTML = "";

  // Create the table element and append it to the output
  output.appendChild(createTable(msg73));
  const msg74 = JSON.parse(msg73);

  // **Debugging:** Check if "End Analysis" is present and its validity
  if (msg74.length > 0 && msg74[msg74.length - 1].details === "End Analysis") {
    // Extract the recommended move (assuming details format is consistent)
    const x = msg74[msg74.length - 4].details.length - 4;
    const mymove = msg74[msg74.length - 4].details.slice(x,);
    // Ensure move format is valid (length of 4)
    if (mymove.length !== 4) {
      alert("Invalid move format received from worker:", mymove);
      return; // Exit the function if format is wrong
    }

    // Convert move string to coordinates (assuming logic is correct)
    let fromRow = mymove.charCodeAt(1) - 49;
    const fromCol = mymove.charCodeAt(0) - 97;
    let toRow = mymove.charCodeAt(3) - 49;
    const toCol = mymove.charCodeAt(2) - 97;

    if (stm) {
      fromRow ^= 7;
      toRow ^= 7;
    }
    // Make the move on the board (assuming move and makemove functions work)
    const move32 = move(fromRow, fromCol, toRow, toCol);
    if (stm)
      start = transpose(start);
    start = makemove(start, move32);
    if (!stm)
      start = transpose(start);
    // Update the chessboard display (assuming drawChessboard function works)
    drawChessboard(start);
    if (!stm)
      start = transpose(start);
    stm ^= 1;
    output.innerHTML = `my move: ${mymove}`;
    if (abs(convertLastWordToFloat(msg74[msg74.length - 3].details)) > 7500) {
      start = board;
      worker.postMessage({ start: JSON.stringify({gstart: start, stm: 1, searchDepth}) });
    }
    else if (!stm && cw || stm && cb)
      worker.postMessage({ start: JSON.stringify({gstart: start, stm, searchDepth}) });
    if (stm)
      start = transpose(start);
  }
};

function abs(x) {
  return x < 0 ? -x : x;
}

function convertLastWordToFloat(str) {
  const words = str.split(" ");
  const lastWord = words[words.length - 1];
  return parseFloat(lastWord);
}

function parsePGN(pgnString) {
  const pgn = pgnString.replace(/\r\n|\r|\n/g, '\n'); // Normalize line endings

  const games = [];
  let currentGame = {};
  let currentMove = 1;
  let inComment = false;
  let inVariation = false;

  for (let i = 0; i < pgn.length; i++) {
    const char = pgn.charAt(i);

    if (char === '[') {
      // Start of a tag
      const tagEnd = pgn.indexOf(']', i);
      const tagString = pgn.substring(i + 1, tagEnd);
      const [tagName, tagValue] = tagString.split('=');
      currentGame[tagName] = tagValue.trim();
      i = tagEnd;
    } else if (char === '{') {
      // Start of a comment
      inComment = true;
    } else if (char === '}') {
      // End of a comment
      inComment = false;
    } else if (char === '(') {
      // Start of a variation
      inVariation = true;
      currentMove--; // Decrement move number for variation
    } else if (char === ')') {
      // End of a variation
      inVariation = false;
    } else if (!inComment && !inVariation && char.match(/\d+\./)) {
      // Start of a new move
      currentGame.moves = currentGame.moves || [];
      currentGame.moves.push({
        moveNumber: currentMove,
        white: '',
        black: '',
      });
      currentMove++;
    } else if (!inComment && !inVariation && char !== ' ' && char !== '\n') {
      // Part of a move
      const moveRegex = /([NBRQK]?[a-h]\d{1,2}|O-O|O-O-O)([^#]*)/;
      const match = moveRegex.exec(pgn.substring(i));
      if (match) {
        const move = match[1];
        const result = match[2];
        if (currentGame.moves[currentGame.moves.length - 1].white === '') {
          currentGame.moves[currentGame.moves.length - 1].white = move;
        } else {
          currentGame.moves[currentGame.moves.length - 1].black = move;
        }
        i += match[0].length - 1; // Adjust index for captured characters
      }
    } else if (char === '\n') {
      // End of line
      if (!inComment && !inVariation && currentGame.moves) {
        games.push(currentGame);
        currentGame = {};
        currentMove = 1;
      }
    }
  }

  if (currentGame.moves) {
    games.push(currentGame);
  }

  return games;
}

function sanToUci(san, board) {
  // Validate input
  if (!san || !board) {
    throw new Error("Invalid input: SAN or board cannot be null or undefined.");
  }

  // Handle special cases
  if (san === "O-O") {
    return board.isWhiteToMove() ? "g1h1" : "g8h8";
  }
  if (san === "O-O-O") {
    return board.isWhiteToMove() ? "c1g1" : "c8g8";
  }

  // Extract move components
  const [piece, from, to] = san.match(/([RNBQK])?([a-h]\d)([a-h]\d)/).slice(1);

  // Determine piece type
  const pieceType = piece ? piece.toLowerCase() : board.getPiece(from).type;

  // Handle pawn promotions
  if (pieceType === "p" && to.charAt(1) === "8" && board.isWhiteToMove() || to.charAt(1) === "1" && !board.isWhiteToMove()) {
    const promotion = san.match(/([QRNB])\d/);
    if (promotion) {
      return from + to + promotion[1].toLowerCase();
    } else {
      throw new Error("Invalid promotion notation: missing promotion piece.");
    }
  }

  // Handle captures
  if (board.getPiece(to)) {
    return from + "x" + to;
  }

  return from + to;
}

function uciToSan(uci) {
  const board = new Array(8).fill().map(() => new Array(8).fill(0));
  const pieceMap = {
    R: 'R',
    N: 'N',
    B: 'B',
    Q: 'Q',
    K: 'K',
    P: 'P',
    r: 'r',
    n: 'n',
    b: 'b',
    q: 'q',
    k: 'k',
  };
  const rankMap = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const fileMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  // Populate the board with pieces
  for (let i = 0; i < uci.length; i += 2) {
    const file = uci.charCodeAt(i) - 97;
    const rank = 7 - (uci.charCodeAt(i + 1) - 49);
    board[rank][file] = pieceMap[uci[i]];
  }

  // Determine the moving piece and its destination
  const movingPiece = board[7 - (uci.charCodeAt(uci.length - 2) - 49)][uci.charCodeAt(uci.length - 1) - 97];
  const destinationRank = rankMap[7 - (uci.charCodeAt(uci.length - 2) - 49)];
  const destinationFile = fileMap[uci.charCodeAt(uci.length - 1) - 97];

  // Check for castling
  if (movingPiece === 'K' && (uci === 'e1g1' || uci === 'e1c1' || uci === 'e8g8' || uci === 'e8c8')) {
    if (uci === 'e1g1') {
      return 'O-O';
    } else if (uci === 'e1c1') {
      return 'O-O-O';
    } else if (uci === 'e8g8') {
      return 'O-O';
    } else {
      return 'O-O-O';
    }
  }

  // Handle pawn promotions
  if (movingPiece === 'P' && (destinationRank === '1' || destinationRank === '8')) {
    const promotionPiece = uci.charAt(uci.length - 1);
    return destinationFile + destinationRank + '=' + promotionPiece;
  }

  // Handle captures
  if (board[7 - (uci.charCodeAt(uci.length - 4) - 49)][uci.charCodeAt(uci.length - 3) - 97] !== 0) {
    return fileMap[uci.charCodeAt(uci.length - 3) - 97] + 'x' + destinationFile + destinationRank;
  }

  // Handle ambiguous moves
  if (board[7 - (uci.charCodeAt(uci.length - 4) - 49)][uci.charCodeAt(uci.length - 3) - 97] === movingPiece) {
    const ambiguousFile = fileMap[uci.charCodeAt(uci.length - 3) - 97];
    const ambiguousRank = rankMap[7 - (uci.charCodeAt(uci.length - 4) - 49)];
    return ambiguousFile + ambiguousRank + movingPiece + destinationFile + destinationRank;
  }

  // Return the SAN notation
  return movingPiece + destinationFile + destinationRank;
}

