import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export const SIZE = 4;

export type Player = 'X' | 'O';
export type TileValue = Player | 'empty';

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

const DEFAULT_STATE: BoardState = {
  isPlayer2Move: false,
  tiles: new Array<TileValue>(SIZE * SIZE).fill('empty'),
  size: SIZE,
};

@Injectable()
export class BoardStateService {
  private stateSubj = new BehaviorSubject<BoardState>(DEFAULT_STATE);

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
    this.stateSubj.next(DEFAULT_STATE);
  }

  public tryMakeMove(idx: number): boolean {
    if (!this.checkMoveValid(idx)) {
      return false;
    }

    const { tiles, isPlayer2Move } = this.stateSubj.value;
    const player: Player = isPlayer2Move ? 'O' : 'X';
    const newTiles = [...tiles];
    newTiles[idx] = player;

    const winner = this.checkWinner(newTiles) ? player : undefined;

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
      idx < SIZE * SIZE && // index out of bounds
      state.tiles[idx] === 'empty' // tile already occupied
    );
  }

  private checkWinner(board: TileValue[]): boolean {
    const isWinningSegment = (arr: TileValue[]) =>
      arr.every((val) => val === arr[0] && arr[0] !== 'empty');

    const diag1 = board.filter((_, i) => i % (SIZE + 1) === 0);
    if (isWinningSegment(diag1)) {
      return true;
    }

    const diag2Idx = Array.from({ length: SIZE }).map(
      (_, i) => (i + 1) * (SIZE - 1)
    );
    const diag2 = board.filter((_, i) => diag2Idx.includes(i));
    if (isWinningSegment(diag2)) {
      return true;
    }

    for (let offset = 0; offset < SIZE; offset++) {
      const row = board.slice(offset * SIZE, (offset + 1) * SIZE);
      if (isWinningSegment(row)) {
        return true;
      }

      const col = board.filter((_, i) => i % SIZE == offset);
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
