import { BACKWARD, FORWARD, LEFT, RIGHT } from '@warriorjs/geography';
// import { attack, feel } from '@warriorjs/abilities';

import ThickSludge from './ThickSludge';

jest.mock('@warriorjs/abilities');
// jest.mock('@warriorjs/abilities', () => ({
//   attack: jest.fn(),
//   feel: jest.fn(),
// }));

describe('ThickSludge', () => {
  test("appears as 'S' on map", () => {
    expect(ThickSludge.character).toBe('S');
  });

  test('has 24 max health', () => {
    expect(ThickSludge.maxHealth).toBe(24);
  });

  test('has attack ability with power 3', () => {
    expect(ThickSludge.abilities).toHaveProperty('attack');
    // expect(attack).toHaveBeenCalledWith({ power: 3 });
  });

  test('has feel ability', () => {
    expect(ThickSludge.abilities).toHaveProperty('feel');
    // expect(feel).toHaveBeenCalled();
  });

  describe('playing turn', () => {
    let turn;
    let space;

    beforeEach(() => {
      space = { isUnit: () => false };
      turn = {
        attack: jest.fn(),
        feel: jest.fn(() => space),
      };
    });

    test('looks for player in all directions', () => {
      ThickSludge.playTurn(turn);
      expect(turn.feel).toHaveBeenCalledWith(FORWARD);
      expect(turn.feel).toHaveBeenCalledWith(RIGHT);
      expect(turn.feel).toHaveBeenCalledWith(BACKWARD);
      expect(turn.feel).toHaveBeenCalledWith(LEFT);
    });

    test('stops looking if it finds player', () => {
      turn.feel
        .mockReturnValueOnce({ isUnit: () => false })
        .mockReturnValueOnce({
          isUnit: () => true,
          getUnit: () => ({ isPlayer: () => true }),
        });
      ThickSludge.playTurn(turn);
      expect(turn.feel).toHaveBeenCalledWith(FORWARD);
      expect(turn.feel).toHaveBeenCalledWith(RIGHT);
      expect(turn.feel).not.toHaveBeenCalledWith(BACKWARD);
      expect(turn.feel).not.toHaveBeenCalledWith(LEFT);
      expect(turn.attack).toHaveBeenCalledWith(RIGHT);
    });

    test("does nothing if it doesn't find player", () => {
      ThickSludge.playTurn(turn);
      expect(turn.attack).not.toHaveBeenCalled();
    });
  });
});
