import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export type Player = 'X' | 'O';
export type TileValue = Player | 'empty';
export const DEFAULT_SIZE = 3;

interface BoardState {
  isPlayer2Move: boolean;
  tiles: TileValue[];
  size: number;
  winner?: Player;
}

export type BoardStateExternal = BoardState & {
  isGameOver: boolean;
  curPlayer: Player;
};

const buildState = (size: number): BoardState => ({
  isPlayer2Move: false,
  tiles: new Array<TileValue>(size * size).fill('empty'),
  size,
});

@Injectable()
export class BoardStateService {
  private stateSubj = new BehaviorSubject<BoardState>(buildState(DEFAULT_SIZE));

  public state$ = this.stateSubj.pipe(
    map(
      (state): BoardStateExternal => ({
        ...state,
        isGameOver: this.isGameOver(state),
        curPlayer: state.isPlayer2Move ? 'O' : 'X',
      })
    )
  );

  public restart() {
    const { size } = this.stateSubj.value;
    this.setSize(size);
  }

  public setSize(size: number) {
    const state = buildState(size);
    this.stateSubj.next(state);
  }

  public tryMakeMove(idx: number): boolean {
    if (!this.checkMoveValid(idx)) {
      return false;
    }

    const { tiles, isPlayer2Move, size } = this.stateSubj.value;
    const player: Player = isPlayer2Move ? 'O' : 'X';
    const newTiles = [...tiles];
    newTiles[idx] = player;

    const winner = this.checkWinner(newTiles, size) ? player : undefined;

    this.stateSubj.next({
      ...this.stateSubj.value,
      isPlayer2Move: !isPlayer2Move,
      tiles: newTiles,
      winner,
    });

    return true;
  }

  private checkMoveValid(idx: number): boolean {
    const state = this.stateSubj.value;

    return (
      !this.isGameOver(state) && // Game already over
      idx >= 0 &&
      idx < state.size ** 2 && // index out of bounds
      state.tiles[idx] === 'empty' // tile already occupied
    );
  }

  private checkWinner(board: TileValue[], size: number): boolean {
    const isWinningSegment = (arr: TileValue[]) =>
      arr.every((val) => val === arr[0] && arr[0] !== 'empty');

    const diag1 = board.filter((_, i) => i % (size + 1) === 0);
    if (isWinningSegment(diag1)) {
      return true;
    }

    const diag2Idx = Array.from({ length: size }).map(
      (_, i) => (i + 1) * (size - 1)
    );
    const diag2 = board.filter((_, i) => diag2Idx.includes(i));
    if (isWinningSegment(diag2)) {
      return true;
    }

    for (let offset = 0; offset < size; offset++) {
      const row = board.slice(offset * size, (offset + 1) * size);
      if (isWinningSegment(row)) {
        return true;
      }

      const col = board.filter((_, i) => i % size == offset);
      if (isWinningSegment(col)) {
        return true;
      }
    }

    return false;
  }

  private isGameOver({ winner, tiles }: BoardState) {
    return Boolean(winner) || tiles.every((x) => x !== 'empty');
  }
}
