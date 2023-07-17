import {
  BoardStateExternal,
  BoardStateService,
  DEFAULT_SIZE,
  TileValue,
} from './board-state.service';

const checkInitialState = (state: BoardStateExternal, size: number) => {
  expect(state.curPlayer).withContext('Player x should start').toBe('X');
  expect(state.isPlayer2Move).withContext('Player x should start').toBeFalse();
  expect(state.isGameOver).withContext('Game should be running').toBeFalse();
  expect(state.size).withContext(`Size should be ${size}`).toBe(size);
  expect(state.tiles.length)
    .withContext(`Tiles should be an array of ${size}x${size} tiles`)
    .toBe(size ** 2);
  expect(state.tiles.every((t) => t === 'empty'))
    .withContext('Every tile should be empty')
    .toBeTrue();
  expect(state.winner).withContext('No winner should be set').toBeFalsy();
};

describe('BoardStateService', () => {
  let service: BoardStateService;
  beforeEach(() => {
    service = new BoardStateService();
  });

  it('initial state should be correct', (done: DoneFn) => {
    service.state$.subscribe((state) => {
      checkInitialState(state, DEFAULT_SIZE);
      done();
    });
  });

  it('restart should reset state to initial', (done: DoneFn) => {
    service.restart();
    service.state$.subscribe((state) => {
      checkInitialState(state, DEFAULT_SIZE);
      done();
    });
  });

  it('setting size should start over with new size', (done: DoneFn) => {
    const newSize = 5;
    service.setSize(newSize);
    service.state$.subscribe((state) => {
      checkInitialState(state, newSize);
      done();
    });
  });

  it('making an invalid move should return false without action', (done: DoneFn) => {
    let result = service.tryMakeMove(-1);
    expect(result)
      .withContext('Negative index should not do anything')
      .toBeFalse();

    result = service.tryMakeMove(999);
    expect(result)
      .withContext('Too high index should not do anything')
      .toBeFalse();

    service.state$.subscribe((state) => {
      checkInitialState(state, DEFAULT_SIZE);
      done();
    });
  });

  it('wins should be detected', () => {
    let result = service.checkWinner([], DEFAULT_SIZE);
    expect(result).withContext('Empty grid should not give winner').toBeFalse();

    // prettier-ignore
    let board: TileValue[] = [
        'O', 'X', 'X', 
        'X', 'O', 'O', 
        'O', 'O', 'X'
    ];
    result = service.checkWinner(board, DEFAULT_SIZE);
    expect(result).withContext('Draw should not give winner').toBeFalse();

    // prettier-ignore
    board = [
        'X', 'X', 'X',
        'empty', 'empty', 'empty',
        'empty', 'empty', 'empty',
    ];
    result = service.checkWinner(board, DEFAULT_SIZE);
    expect(result).withContext('Win should be detected 1').toBeTrue();
  });
});
