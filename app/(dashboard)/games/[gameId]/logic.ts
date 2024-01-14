import type { Cell, Coordinate, Moves, NonEmptyCell } from "@/types/zod-types";

export const SIZE = 8;

export function generateBoard(): Cell[][] {
  const board: Cell[][] = [];
  for (let i = 0; i < SIZE; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < SIZE; j++) {
      if (i > 1 && i < SIZE - 2) {
        row.push({ piece: "empty" });
        continue;
      }
      var cell: Cell = { piece: "pawn", color: "white", cronology: [] };
      if (i >= SIZE - 2) cell.color = "black";
      if (i === 1 || i === SIZE - 2) {
        cell.piece = "pawn";
        row.push(cell);
        continue;
      }
      switch (true) {
        case j === 0 || j === SIZE - 1:
          cell.piece = "rook";
          break;
        case j === 1 || j === SIZE - 2:
          cell.piece = "hourse";
          break;
        case j === 2 || j === SIZE - 3:
          cell.piece = "bishop";
          break;
        case j === 3:
          cell.piece = "king";
          break;
        case j === 4:
          cell.piece = "queen";
          break;
      }
      row.push(cell);
    }
    board.push(row);
  }
  return board;
}

export function move(board: Cell[][], { from, to }: Moves) {
  board[to.row]![to.col] = board[from.row]![from.col]!;
  board[from.row]![from.col] = { piece: "empty" };
  return board;
}

export function generateLegalMoves(
  board: Cell[][],
  cell: NonEmptyCell & Coordinate
): Coordinate[] {
  const legalMoves = [];
  for (const candidateMove of generateCandidateMove(board, cell)) {
    const oldPiece = board[candidateMove.row]![candidateMove.col]!;
    move(board, { from: cell, to: candidateMove });

    if (!isCheck(board, cell.color)) {
      legalMoves.push(candidateMove);
    }

    move(board, { from: candidateMove, to: cell });
    board[candidateMove.row]![candidateMove.col] = oldPiece;
  }
  return legalMoves;
}

export function isCheckmateOrStelemate(
  board: Cell[][],
  color: NonEmptyCell["color"],
  isCheckmate: boolean = true
): boolean {
  if (isCheckmate && !isCheck(board, color)) return false;
  const pieces = searchPiece(board, color);
  for (const piece of pieces) {
    if (generateLegalMoves(board, piece).length > 0) return false;
  }
  return true;
}

function generateCandidateMove(
  board: Cell[][],
  cell: NonEmptyCell & Coordinate
): Coordinate[] {
  switch (cell.piece) {
    case "pawn":
      const candidateMoves: Coordinate[] = [];
      const direction = cell.color === "black" ? -1 : 1;
      if (
        isInBoard({ row: cell.row + direction, col: cell.col }) &&
        board[cell.row + direction]![cell.col]?.piece === "empty"
      ) {
        candidateMoves.push({ row: cell.row + direction, col: cell.col });
      }
      if (
        cell.cronology.length === 0 &&
        isInBoard({ row: cell.row + 2 * direction, col: cell.col }) &&
        board[cell.row + 2 * direction]![cell.col]?.piece === "empty"
      ) {
        candidateMoves.push({ row: cell.row + 2 * direction, col: cell.col });
      }
      if (
        isInBoard({ row: cell.row + direction, col: cell.col + 1 }) &&
        board[cell.row + direction]![cell.col + 1]?.piece !== "empty" &&
        (board[cell.row + direction]![cell.col + 1] as NonEmptyCell).color !==
          cell.color
      ) {
        if (
          (board[cell.row + direction]![cell.col + 1] as NonEmptyCell).color !==
          cell.color
        )
          candidateMoves.push({ row: cell.row + direction, col: cell.col + 1 });
      }
      if (
        isInBoard({ row: cell.row + direction, col: cell.col - 1 }) &&
        board[cell.row + direction]![cell.col - 1]?.piece !== "empty" &&
        (board[cell.row + direction]![cell.col - 1] as NonEmptyCell).color !==
          cell.color
      ) {
        candidateMoves.push({ row: cell.row + direction, col: cell.col - 1 });
      }

      // En passant
      if (
        isInBoard({ row: cell.row, col: cell.col - 1 }) &&
        board[cell.row]![cell.col - 1]!.piece === "pawn"
      ) {
        const pawn = board[cell.row]![cell.col - 1] as NonEmptyCell;
        if (
          pawn.cronology.length === 1 &&
          Math.abs(
            pawn.cronology.at(0)?.to.row! - pawn.cronology.at(0)?.from.row!
          ) === 2
        ) {
          candidateMoves.push({ row: cell.row + direction, col: cell.col - 1 });
        }
      }
      if (
        isInBoard({ row: cell.row, col: cell.col + 1 }) &&
        board[cell.row]![cell.col + 1]!.piece === "pawn"
      ) {
        const pawn = board[cell.row]![cell.col + 1] as NonEmptyCell;
        if (
          pawn.cronology.length === 1 &&
          Math.abs(
            pawn.cronology.at(0)?.to.row! - pawn.cronology.at(0)?.from.row!
          ) === 2
        ) {
          candidateMoves.push({ row: cell.row + direction, col: cell.col + 1 });
        }
      }
      return candidateMoves;
    case "rook":
      return checkLine(board, cell, [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ]);
    case "bishop":
      return checkLine(board, cell, [
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ]);
    case "hourse":
      return checkLine(
        board,
        cell,
        [
          { row: -1, col: -2 },
          { row: -1, col: 2 },
          { row: 1, col: -2 },
          { row: 1, col: 2 },
          { row: -2, col: -1 },
          { row: -2, col: 1 },
          { row: 2, col: -1 },
          { row: 2, col: 1 },
        ],
        false
      );
    case "king":
      const kingMoves = checkLine(
        board,
        cell,
        [
          { row: 0, col: -1 },
          { row: 0, col: 1 },
          { row: -1, col: -1 },
          { row: -1, col: 0 },
          { row: -1, col: 1 },
          { row: 1, col: -1 },
          { row: 1, col: 0 },
          { row: 1, col: 1 },
        ],
        false
      );

      // Controllo arrocco da sinistra

      // Controllo arrocco da destra
      return kingMoves;
    case "queen":
      return checkLine(board, cell, [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ]);
  }
}

function checkLine(
  board: Cell[][],
  cell: NonEmptyCell & Coordinate,
  directions: Coordinate[],
  isContinue: boolean = true
): Coordinate[] {
  const candidateMoves: Coordinate[] = [];
  directions.forEach((direction) => {
    let i = 1;
    while (
      isInBoard({
        row: cell.row + direction.row * i,
        col: cell.col + direction.col * i,
      })
    ) {
      if (
        board[cell.row + direction.row * i]![cell.col + direction.col * i]
          ?.piece !== "empty"
      ) {
        if (
          (
            board[cell.row + direction.row * i]![
              cell.col + direction.col * i
            ] as NonEmptyCell
          ).color === cell.color
        )
          break;
      }
      candidateMoves.push({
        row: cell.row + direction.row * i,
        col: cell.col + direction.col * i,
      });
      if (!isContinue) break;
      if (
        board[cell.row + direction.row * i]![cell.col + direction.col * i]
          ?.piece !== "empty"
      ) {
        if (
          isReverseColor(
            (
              board[cell.row + direction.row * i]![
                cell.col + direction.col * i
              ] as NonEmptyCell
            ).color,
            cell.color
          )
        )
          break;
      }
      i++;
    }
  });
  return candidateMoves;
}

function isCheck(board: Cell[][], color: NonEmptyCell["color"]): boolean {
  const pieces = searchPiece(board, reverseColor(color));
  const king = searchPiece(board, color, "king").at(0)!;
  for (const piece of pieces)
    if (
      generateCandidateMove(board, piece).find(
        (move) => move.col === king.col && move.row === king.row
      )
    )
      return true;
  return false;
}

function searchPiece(
  board: Cell[][],
  color: NonEmptyCell["color"],
  piece?: NonEmptyCell["piece"]
) {
  const pieces: (NonEmptyCell & Coordinate)[] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.piece === "empty") return;
      if (piece) {
        if (cell.piece === piece && cell.color === color)
          pieces.push({ ...cell, row: rowIndex, col: cellIndex });
      } else if (cell.color === color) {
        pieces.push({ ...cell, row: rowIndex, col: cellIndex });
      }
    });
  });
  return pieces;
}

function isInBoard({ row, col }: Coordinate) {
  return row > -1 && row < SIZE && col > -1 && col < SIZE;
}

function isReverseColor(
  color: NonEmptyCell["color"],
  currentCell: NonEmptyCell["color"]
) {
  return reverseColor(color) === currentCell;
}

export function reverseColor(
  color: NonEmptyCell["color"]
): NonEmptyCell["color"] {
  return color === "black" ? "white" : "black";
}
