import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import { HostContext } from '../../../contexts/HostContext/HostContext';
import HostPregameScreen from './HostPregameScreen';

jest.mock('../../GameSettings/GameSettings', () => () => (
  <div data-testid="game-settings" />
));

function setupFetchMock() {
  jest.spyOn(window, 'fetch').mockImplementation(() => ({
    json: async () => [
      { name: 'test 1' },
      { name: 'test 2' },
      { name: 'test 3' },
    ],
  }));
}

describe('Host Pregame Screen', () => {
  // This is the default state value provided by our context
  let state = {
    gameState: 'waiting-for-lobby',
    lobbyID: '',
    players: {},
    playerIDs: [],
    gameSettings: { maxPlayers: 8, winningScore: 7, selectedPacks: [] },
  };
  const dispatch = jest.fn();

  afterEach(() => {
    // sometimes we need to change the state for test cases, this resets to initial value
    state = {
      gameState: 'waiting-for-lobby',
      lobbyID: '',
      players: {},
      playerIDs: [],
      gameSettings: { maxPlayers: 8, winningScore: 7, selectedPacks: [] },
    };
    setupFetchMock();
  });

  describe('rendering', () => {
    it('renders', () => {
      const tree = renderer
        .create(
          <HostContext.Provider value={{ state, dispatch }}>
            <HostPregameScreen />
          </HostContext.Provider>,
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('lobby', () => {
    it('creates the lobby', () => {
      expect(dispatch).not.toHaveBeenCalled();

      render(
        <HostContext.Provider value={{ state, dispatch }}>
          <HostPregameScreen />
        </HostContext.Provider>,
      );

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: 'CREATE_LOBBY',
        payload: {},
      });
    });
  });

  describe('buttons', () => {
    it('reloads when the close game button is clicked', () => {
      // window.location properties are read-only, we have to redefine this object to spy on reload
      Object.defineProperty(window, 'location', {
        value: { reload: jest.fn() },
      });
      render(
        <HostContext.Provider value={{ state, dispatch }}>
          <HostPregameScreen />
        </HostContext.Provider>,
      );

      userEvent.click(screen.getByText('CLOSE GAME'));

      expect(window.location.reload).toHaveBeenCalledTimes(1);
      // create lobby, close game
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: 'CLOSE_GAME',
        payload: {},
      });
    });

    it('calls dispatches with the proper payloads when the starting conditions are met and the start button is pressed', async () => {
      setupFetchMock({
        black: ['foo', 'bar', 'baz'],
        white: ['boo', 'far', 'faz'],
      });

      state = {
        gameState: 'waiting-for-lobby',
        lobbyID: '',
        players: {
          foo: {
            name: 'Bender',
            score: 0,
            isCzar: false,
            submittedCards: [],
            cards: [],
          },
          bar: {
            name: 'Briggs',
            score: 0,
            isCzar: false,
            submittedCards: [],
            cards: [],
          },
          baz: {
            name: 'Pedro',
            score: 0,
            isCzar: false,
            submittedCards: [],
            cards: [],
          },
        },
        playerIDs: ['foo', 'bar', 'baz'],
        gameSettings: {
          maxPlayers: 8,
          winningScore: 7,
          selectedPacks: [0, 1, 2],
        },
        deck: { black: [], white: [] },
      };

      render(
        <HostContext.Provider value={{ state, dispatch }}>
          <HostPregameScreen />
        </HostContext.Provider>,
      );

      userEvent.click(screen.getByText('START CAROUSING'));

      // create lobby, get deck, set game state, set new czar, get black card
      expect(dispatch).toHaveBeenCalledTimes(5);
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: 'SET_DECK',
        payload: { selectedPacks: state.gameSettings.selectedPacks },
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: 'START_GAME',
        payload: {},
      });
      expect(dispatch).toHaveBeenNthCalledWith(4, {
        type: 'SET_NEXT_CZAR',
        payload: {},
      });
      expect(dispatch).toHaveBeenNthCalledWith(5, {
        type: 'SELECT_BLACK_CARD',
        payload: {},
      });
    });

    it('does not call dispatch if no players are in the lobby when the start button is clicked', () => {
      render(
        <HostContext.Provider value={{ state, dispatch }}>
          <HostPregameScreen />
        </HostContext.Provider>,
      );

      userEvent.click(screen.getByText('START CAROUSING'));

      // only create lobby called
      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it('does not call dispatch if no packs are selected when the start button is clicked', () => {
      state = {
        gameState: 'waiting-for-lobby',
        lobbyID: '',
        players: {
          foo: {
            name: 'Bender',
            score: 0,
            isCzar: false,
            submittedCards: [],
            cards: [],
          },
          bar: {
            name: 'Briggs',
            score: 0,
            isCzar: false,
            submittedCards: [],
            cards: [],
          },
          baz: {
            name: 'Pedro',
            score: 0,
            isCzar: false,
            submittedCards: [],
            cards: [],
          },
        },
        playerIDs: ['foo', 'bar', 'baz'],
        gameSettings: { maxPlayers: 8, winningScore: 7, selectedPacks: [] },
        deck: { black: [], white: [] },
      };
      render(
        <HostContext.Provider value={{ state, dispatch }}>
          <HostPregameScreen />
        </HostContext.Provider>,
      );

      userEvent.click(screen.getByText('START CAROUSING'));

      // only create lobby called
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).not.toHaveBeenCalledWith({
        type: 'SET_DECK',
        payload: { selectedPacks: state.gameSettings.selectedPacks },
      });
      expect(dispatch).not.toHaveBeenCalledWith({
        type: 'START_GAME',
        payload: {},
      });
      expect(dispatch).not.toHaveBeenCalledWith({
        type: 'SET_NEXT_CZAR',
        payload: {},
      });
    });
  });
});
