"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SIZE,
  generateBoard,
  generateLegalMoves,
  isCheckmateOrStelemate,
  move,
  reverseColor,
} from "./logic";
import { alphabet, cn } from "@/lib/utils";
import type { Cell, Coordinate, Moves, NonEmptyCell } from "@/types/chess";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useMatch } from "@/stores/use-match";
import { emitSocket, offSocket, onSocket } from "@/stores/use-socket";

export default function ChessPage({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const [registryMoves, setRegistryMoves] = useState<
    (Moves & { color: NonEmptyCell["color"] })[]
  >([]);
  const { toast } = useToast();
  const { currentTurn: myTurn } = useMatch();
  const [board, setBoard] = useState<Cell[][]>(generateBoard());
  const [currentTurn, setCurrentTurn] =
    useState<NonEmptyCell["color"]>("white");
  const [selectedPiece, setSelectedPiece] = useState<
    (NonEmptyCell & Coordinate) | null
  >(null);
  const [legalMoves, setLegalMoves] = useState<Coordinate[]>([]);

  useEffect(() => {
    emitSocket("game", "join", gameId);

    onSocket("game", "move", (moves) => {
      setBoard(move(board, moves.moves));
      setLegalMoves([]);

      setCurrentTurn((prevTurn) => reverseColor(prevTurn));
    });

    return () => {
      offSocket("game", "move");
    };
  }, []);

  useEffect(() => {
    setLegalMoves([]);
    if (selectedPiece) {
      setLegalMoves(generateLegalMoves(board, selectedPiece));
    }
  }, [selectedPiece]);

  const handleClick = useCallback(
    (cell: Cell & Coordinate) => {
      if (!selectedPiece) {
        if (cell.piece !== "empty") setSelectedPiece(cell);
        else setLegalMoves([]);
      } else {
        if (
          selectedPiece.color === currentTurn &&
          currentTurn === myTurn &&
          legalMoves.find(
            (move) => move.row === cell.row && move.col === cell.col,
          )
        ) {
          setLegalMoves([]);
          (
            board[selectedPiece.row]![selectedPiece.col] as NonEmptyCell
          ).cronology.push({
            from: { row: selectedPiece.row, col: selectedPiece.col },
            to: { row: cell.row, col: cell.col },
          });
          if (
            selectedPiece.piece === "pawn" &&
            cell.col !== selectedPiece.col &&
            cell.piece === "empty"
          ) {
            const direction = selectedPiece.color === "black" ? 1 : -1;
            board[cell.row + direction]![cell.col]!.piece = "empty";
          }
          move(board, {
            from: { row: selectedPiece.row, col: selectedPiece.col },
            to: { row: cell.row, col: cell.col },
          });
          setRegistryMoves((prevMove) => [
            ...prevMove,
            {
              from: { row: selectedPiece.row, col: selectedPiece.col },
              to: { row: cell.row, col: cell.col },
              color: currentTurn,
            },
          ]);
          emitSocket("game", "move", {
            gameId,
            moves: {
              from: { row: selectedPiece.row, col: selectedPiece.col },
              to: { row: cell.row, col: cell.col },
            },
          });
          if (isCheckmateOrStelemate(board, reverseColor(currentTurn))) {
            console.log("scacco matto");
            toast({
              title: "Check mate",
              description: "You lose",
            });
          }
          if (isCheckmateOrStelemate(board, reverseColor(currentTurn), false)) {
            toast({
              title: "Stelemate",
              description: "You lose",
            });
          }
          setCurrentTurn((prevTurn) => reverseColor(prevTurn));
          setLegalMoves([]);
        } else if (cell.piece !== "empty") {
          setSelectedPiece(cell);
        }
      }
    },
    [legalMoves, selectedPiece, board],
  );

  return (
    <>
      {currentTurn === "white" && (
        <div
          className={cn(
            "absolute h-10 w-10 animate-ping rounded-full bg-green-500",
          )}
        />
      )}
      <ScrollArea className="mt-10 flex h-10 w-80 items-center whitespace-nowrap">
        {registryMoves.map((move, index) => (
          <Badge
            key={index}
            variant={move.color === "black" ? "default" : "outline"}
            className="ml-2"
          >
            {alphabet[move.from.col]?.toUpperCase()}
            {move.from.row + 1}-{alphabet[move.to.col]?.toUpperCase()}
            {move.to.row}
          </Badge>
        ))}
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
      <table>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="h-20 w-8 text-center">
                {myTurn === "white" ? SIZE - rowIndex : rowIndex + 1}
              </td>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "relative h-20 w-20",
                    (rowIndex + cellIndex) % 2 === 0 ? "bg-accent" : "bg-card",
                    selectedPiece?.col === cellIndex &&
                      selectedPiece.row === rowIndex &&
                      "bg-primary/50",
                  )}
                  onClick={() =>
                    handleClick({
                      ...cell,
                      ...{ row: rowIndex, col: cellIndex },
                    })
                  }
                >
                  {legalMoves.find(
                    (move) => move.row === rowIndex && move.col === cellIndex,
                  ) && (
                    <div
                      className={cn(
                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                        cell.piece !== "empty"
                          ? "z-0 h-16 w-16 border-8 border-foreground/50"
                          : "h-6 w-6 bg-foreground/50",
                      )}
                    />
                  )}
                  {cell.piece !== "empty" && (
                    <Image
                      src={`/images/${cell.color.at(0)}${cell.piece.at(0)}.png`}
                      alt={`${cell.color.at(0)}${cell.piece.at(0)}`}
                      width={100}
                      height={100}
                      placeholder="blur"
                      className="z-10"
                      blurDataURL={`/images/${cell.color.at(0)}${cell.piece.at(
                        0,
                      )}.png`}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            {alphabet
              .toUpperCase()
              .substring(0, SIZE)
              .split("")
              .map((item) => (
                <td key={item} className="h-8 w-20 text-center">
                  {item}
                </td>
              ))}
          </tr>
        </tfoot>
      </table>
      {currentTurn === "black" && (
        <div
          className={cn("h-10 w-10 animate-ping rounded-full bg-green-500")}
        />
      )}
    </>
  );
}
