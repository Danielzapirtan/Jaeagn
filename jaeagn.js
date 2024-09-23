const init = [
  [4, 2, 3, 5, 6, 3, 2, 4],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [-4, -2, -3, -5, -6, -3, -2, -4]
];

const canvas = document.getElementById("chessboard");
const ctx = canvas.getContext("2d");
const squareSize = canvas.width / 8;
const pieceSize = squareSize * 0.8;

function drawBoard() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? "cyan" : "green";
      ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
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
    case "R":
      return "♜";
    case "N":
      return "♞";
    case "B":
      return "♝";
    case "Q":
      return "♛";
    case "K":
      return "♚";
    case "P":
      return "♟";
    default:
      return "";
  }
}

function drawChessboard(board13) {
  drawBoard();
  drawPieces(board13);
}

let date0;

let nodes;
let gstart;
let gbestmove;

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
  const squareSize = canvas.width / 8;
  const i3 = 7 - Math.floor(y / squareSize);
  const j3 = Math.floor(x / squareSize);
  handleClick(i3, j3);
});

const output = document.getElementById("output");
let display = [];

function eval1(board6, level) {
  let countk = 0;
  let value = 0;
  nodes++;
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      const piece1 = board6.board[i][j];
      if (piece1[0] === "K") countk += 1 - 2 * (piece1[1] !== "white");
      else if (piece1[0] === "Q")
        value += 980 * (1 - 2 * (piece1[1] !== "white"));
      else if (piece1[0] === "R")
        value += 500 * (1 - 2 * (piece1[1] !== "white"));
      else if (piece1[0] === "B")
        value += 325 * (1 - 2 * (piece1[1] !== "white"));
      else if (piece1[0] === "N")
        value += 315 * (1 - 2 * (piece1[1] !== "white"));
      else if (piece1[0] === "P")
        value += 100 * (1 - 2 * (piece1[1] !== "white"));
    }
  return 16000 * countk + value + Math.random() * 19 - 9;
}

function gendeep(board2, depthFlag, candFlag) {
  const movelist2 = [];
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      if (board2.board[i][j][0] === "N")
        if (board2.board[i][j][1] === "black") {
          const movelist4 = genKnight(board2, i, j);
          movelist4.forEach((move12) => {
            movelist2.push(move12);
          });
        }
      if (board2.board[i][j][0] === "P")
        if (board2.board[i][j][1] === "black") {
          const move13 = move(i, j, i + 1, j);
          if (board2.board[i + 1][j][0] === "") {
            movelist2.push(move13);
            if (i === 1) {
              if (board2.board[i + 2][j][0] === "") {
                const move14 = move(i, j, i + 2, j);
                movelist2.push(move14);
              }
            }
          }
          try {
            if (board2.board[i + 1][j - 1][1] === "white") {
              const move15 = move(i, j, i + 1, j - 1);
              movelist2.push(move15);
            }
          } catch {}
          try {
            if (board2.board[i + 1][j + 1][1] === "white") {
              const move15 = move(i, j, i + 1, j + 1);
              movelist2.push(move15);
            }
          } catch {}
        }
      if (board2.board[i][j][0] === "B")
        if (board2.board[i][j][1] === "black") {
          const movelist5 = genBishop(board2, i, j);
          movelist5.forEach((move13) => {
            movelist2.push(move13);
          });
        }
      if (board2.board[i][j][0] === "R")
        if (board2.board[i][j][1] === "black") {
          const movelist5 = genRook(board2, i, j);
          movelist5.forEach((move13) => {
            movelist2.push(move13);
          });
        }
      if (board2.board[i][j][0] === "Q")
        if (board2.board[i][j][1] === "black") {
          const movelist5 = genBishop(board2, i, j);
          const movelist6 = genRook(board2, i, j);
          movelist5.forEach((move13) => {
            movelist2.push(move13);
          });
          movelist6.forEach((move13) => {
            movelist2.push(move13);
          });
        }
      /*if (board2.board[i][j][0] === "K")
        if (board2.board[i][j][1] === "black") {
          const movelist5 = genKing(board2, i, j);
          movelist5.forEach((move13) => {
            movelist2.push(move13);
          });
        }*/
    }
  if (candFlag) {
    const valuelist = [];
    const movelist3 = [];
    const valuelist3 = [];
    movelist2.forEach((move19) => {
      const board12 = makemove(board2, move19);
      const value = search(board12, 0, 2, -20000, 20000);
      valuelist.push(value);
    });
    for (let ix = 0; ix < movelist2.length; ix++)
      for (let iy = ix + 1; iy < movelist2.length; iy++) {
        if (valuelist[iy] < valuelist[ix]) {
          for (let iz = 0; iz < movelist2.length; iz++) {
            if (iz === ix) {
              movelist3.push(movelist2[iy]);
              valuelist3.push(valuelist[iy]);
            } else if (iz === iy) {
              movelist3.push(movelist2[ix]);
              valuelist3.push(valuelist[ix]);
            } else {
              movelist3.push(movelist2[iz]);
              valuelist3.push(valuelist[iz]);
            }
          }
        }
      }
    const movelist4 = [];
    movelist3.forEach((move20) => {
      if (movelist4.length < 6) movelist4.push(move20);
    });
    return movelist4;
  } else return movelist2;
}

function genKnight(board10, i0, j0) {
  const movelist3 = [];
  for (let i1 = 0; i1 < 8; i1++)
    for (let j1 = 0; j1 < 8; j1++)
      if (board10.board[i1][j1][1] !== "black")
        if ((i1 - i0) * (i1 - i0) + (j1 - j0) * (j1 - j0) === 5) {
          const move4 = move(i0, j0, i1, j1);
          movelist3.push(move4);
        }
  return movelist3;
}

function genBishop(board10, i0, j0) {
  const movelist3 = [];
  const arrows = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
  ];
  arrows.forEach((arrow) => {
    const movelist4 = slider(board10, i0, j0, arrow[0], arrow[1]);
    movelist4.forEach((move15) => {
      movelist3.push(move15);
    });
  });
  return movelist3;
}

function genRook(board10, i0, j0) {
  const movelist3 = [];
  const arrows = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0]
  ];
  arrows.forEach((arrow) => {
    const movelist4 = slider(board10, i0, j0, arrow[0], arrow[1]);
    movelist4.forEach((move15) => {
      movelist3.push(move15);
    });
  });
  return movelist3;
}

function genKing(board10, i0, j0) {
  const movelist4 = [];
  for (let di = -1; di < 2; di++)
    for (let dj = -1; dj < 2; dj++)
      if (di !== 0 || dj !== 0)
        if (board10.board[i0 + di][j0 + dj][1] !== "black") {
          const move18 = move(i0, j0, i0 + di, j0 + dj);
          movelist4.push(move18);
        }
  output.value = movelist4.length;
  return movelist4;
}

function slider(board10, i0, j0, di, dj) {
  const movelist5 = [];
  let i1 = i0;
  let j1 = j0;
  while (1) {
    i1 += di;
    j1 += dj;
    try {
      if (board10.board[i1][j1][1] === "black") break;
      const move17 = move(i0, j0, i1, j1);
      movelist5.push(move17);
      if (board10.board[i1][j1][1] === "white") break;
    } catch {
      break;
    }
  }
  return movelist5;
}

let stm = 0;

function search(board1, level1, depth1, alpha1, beta1) {
  if (depth1 === 0) {
    const value2 = eval1(board1, level1);
    return value2;
  }
  if (depth1 < 3) {
    const value2 = eval1(board1, level1);
    if (value2 > -50) return value2;
  }
  const movelist = gendeep(board1, 0, level1 > 0 && depth1 > 2);
  let best = -32000;
  movelist.forEach((move1) => {
    /*if (level1 === 0 && depth1 > 3) { output.innerHTML += `${move1} `; }*/
    const board4 = makemove(board1, move1);
    const value1 = -search(board4, level1 + 1, depth1 - 1, -beta1, -alpha1);
    if (value1 > best) {
      best = value1;
      const bestmove = move1;
      if (stm) {
        bestmove[0] ^= 7;
        bestmove[2] ^= 7;
      }
      const strbm = String.fromCharCode(bestmove[1] + 97) + String.fromCharCode(bestmove[0] + 49) + String.fromCharCode(bestmove[3] + 97) + String.fromCharCode(bestmove[2] + 49);
      gbestmove = bestmove;
      if (level1 === 0 && depth1 > 3) {
        const date1 = new Date();
        const secs = (date1 - date0) / 1000.0;
        const nps = parseInt(nodes / secs);
        let msg = {
          bestmove: strbm,
          depth: depth1,
          nps: nps,
          time: parseInt(date1 - date0)
        };
        const msg2 = JSON.stringify(msg);
        output.innerHTML += `${msg2}<br>`;
      }
      if (best > alpha1) alpha1 = best;
      if (alpha1 >= beta1) return best;
    }
  });
  return best;
}

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

let gdepth;
function analysis() {
  nodes = 0;
  date0 = new Date();
  for (let depth3 = 2; depth3 < 13; depth3++) {
    search(gstart, 0, depth3, -20000, 20000);
  }
}

let sqs = 0;
let i7;
let j7;
let start = board;
drawChessboard(start);
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
  }
  sqs ^= 1;
}

// main.js
const worker = new Worker('worker.js');

worker.onmessage = (event) => {
  alert(event);
  output.innerHTML += `${event.data}`;
};

function jana() {
  worker.postMessage({ start: JSON.stringify(gstart) }); // Example input data
}
