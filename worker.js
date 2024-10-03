const board = transpose(
  JSON.parse(
    '{"board":[[["R", "black"], ["N", "black"], ["B", "black"], ["Q", "black"], ["K", "black"], ["B", "black"], ["N", "black"], ["R", "black"]], [["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"], ["P", "black"]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]], [["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"], ["P", "white"]], [["R", "white"], ["N", "white"], ["B", "white"], ["Q", "white"], ["K", "white"], ["B", "white"], ["N", "white"], ["R", "white"]]]}'
  )
);

let display = [];
let gdepth;
let gstart;
const sdepth = 4;

function eval1(board6, level) {
  let countk = 0;
  let value = 0;
  nodes++;
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      const piece1 = board6.board[i][j];
      if (piece1[0] === "K") countk += (1 - 2 * (piece1[1] === "white"));
      else if (piece1[0] === "Q")
        value += 980 * (1 - 2 * (piece1[1] === "white"));
      else if (piece1[0] === "R")
        value += 500 * (1 - 2 * (piece1[1] === "white"));
      else if (piece1[0] === "B")
        value += 325 * (1 - 2 * (piece1[1] === "white"));
      else if (piece1[0] === "N")
        value += 315 * (1 - 2 * (piece1[1] === "white"));
      else if (piece1[0] === "P")
        value += 100 * (1 - 2 * (piece1[1] === "white"));
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
      if (board2.board[i][j][0] === "K")
        if (board2.board[i][j][1] === "black") {
          const movelist5 = genKing(board2, i, j);
          movelist5.forEach((move13) => {
            movelist2.push(move13);
          });
        }
    }
  if (candFlag) {
    const valuelist = [];
    const movelist3 = [];
    const valuelist3 = [];
    movelist2.forEach((move19) => {
      const board12 = makemove(board2, move19);
      const value = -search(board12, 0, sdepth - 1, -20000, 20000);
      valuelist.push(value);
    });
    for (let ix = 0; ix < movelist2.length; ix++)
      for (let iy = ix + 1; iy < movelist2.length; iy++) {
        if (valuelist[iy] > valuelist[ix]) {
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

  // Regular king moves
  for (let di = -1; di < 2; di++) {
    for (let dj = -1; dj < 2; dj++) {
      if (di !== 0 || dj !== 0) {
        try {
          if (board10.board[i0 + di][j0 + dj][1] !== "black") {
            const move18 = move(i0, j0, i0 + di, j0 + dj);
            movelist4.push(move18);
          }
        } catch {}
      }
    }
  }

  // Castling
  if (board10.board[i0][j0][1] === "black") {
    // Kingside castling
    if (
      board10.board[i0][j0 + 1][0] === "" &&
      board10.board[i0][j0 + 2][0] === "" &&
      board10.board[i0][j0 + 3][0] === "" &&
      board10.board[i0][j0 + 3][1] === "black" &&
      !isKingInCheck(board10, i0, j0) &&
      !isKingInCheck(board10, i0, j0 + 1) &&
      !isKingInCheck(board10, i0, j0 + 2)
    ) {
      movelist4.push(move(i0, j0, i0, j0 + 2));
    }

    // Queenside castling
    if (
      board10.board[i0][j0 - 1][0] === "" &&
      board10.board[i0][j0 - 2][0] === "" &&
      board10.board[i0][j0 - 3][0] === "" &&
      board10.board[i0][j0 - 4][0] === "R" &&
      board10.board[i0][j0 - 4][1] === "black" &&
      !isKingInCheck(board10, i0, j0) &&
      !isKingInCheck(board10, i0, j0 - 1) &&
      !isKingInCheck(board10, i0, j0 - 2)
    ) {
      movelist4.push(move(i0, j0, i0, j0 - 2));
    }
  }

  return movelist4;
}

// Function to check if the king is in check
function isKingInCheck(board10, i0, j0) {
  // ... Implement logic to check if the king is in check ...
  return False;
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

let stm;
let msg;

function search(board1, level1, depth1, alpha1, beta1) {
  if (depth1 === 0) {
    const value2 = eval1(board1, level1);
    return value2;
  }
  if (depth1 < 3) {
    const value2 = eval1(board1, level1);
    if (value2 > -50) return value2;
  }
  const movelist = gendeep(board1, 0, level1 > 0 && depth1 > sdepth);
  let best = -32000;
  movelist.forEach((move1) => {
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
      if (level1 === 0 && depth1 > sdepth) {
        const date1 = new Date();
        const secs = (date1 - date0) / 1000.0;
        const nps = parseInt(nodes / secs);
        const formattedDate = date1.toISOString().slice(0, 19).replace('T', ' ');
        msg = {
          timestamp: formattedDate,
          details: `Best move ${strbm}`
        };
        display.push(msg);
        msg = {
          timestamp: formattedDate,
          details: `Score: ${best.toFixed(2)}`
        };
        display.push(msg);
        msg = {
          timestamp: formattedDate,
          details: `Search Stats Depth: ${depth1} NPS: ${nps} Time: ${parseInt(date1 - date0)}ms`
        };
        display.push(msg);
        self.postMessage({
          variations: JSON.stringify(display),
        });
      }
      if (best > alpha1) alpha1 = best;
      if (alpha1 >= beta1) return best;
    }
  });
  return best;
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

let searchDepth;

function analysis() {
  display = [];
  nodes = 0;
  date0 = new Date();
  for (let depth3 = 2; depth3 <= searchDepth; depth3++) {
    search(gstart, 0, depth3, -20000, 20000);
  }
  const formattedDate22 = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  const msg22 = {
    timestamp: formattedDate22,
    details: "End Analysis"
  };
  display.push(msg22);
  self.postMessage({
    variations: JSON.stringify(display),
  });
  return display;
}

// worker.js
gstart = board;

self.onmessage = (event) => {
  const data = JSON.parse(event.data.start);
  gstart = data.gstart;
  stm = data.stm;
  searchDepth = data.searchDepth;
  if (stm < 2)
    variations = analysis();
};
