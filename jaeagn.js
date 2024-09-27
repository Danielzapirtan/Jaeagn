const canvas = document.getElementById("chessboard");
const ctx = canvas.getContext("2d");
const squareSize = canvas.width / 9;
const pieceSize = squareSize * 0.8;
const worker = new Worker('worker.js');

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
	return piece1;
}

function drawChessboard(board13) {
  drawBoard();
  drawPieces(board13);
}

let gstart;

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
  handleClick(i3, j3);
});

const output = document.getElementById("output");
let display = [];
let stm = 0;

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
worker.postMessage({ start: JSON.stringify({gstart, stm}) });
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
    worker.postMessage({ start: JSON.stringify({gstart, stm}) });
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
    if (abs(convertLastWordToFloat(msg74[msg74.length - 3].details)) > 7500) { 
        worker.postMessage({ start: JSON.stringify({gstart: start, stm: 2}) });
     }
     else if (stm)
       worker.postMessage({ start: JSON.stringify({gstart: start, stm}) });
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
