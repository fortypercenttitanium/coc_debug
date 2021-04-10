import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { HostContext } from '../../../contexts/HostContext/HostContext';
import HostBlackCardScreen from './HostBlackCardScreen';

jest.mock('../../GameSettings/GameSettings', () => () => (
  <div data-testid="game-settings" />
));

describe('Host Black Card Screen', () => {
  // This is the default state value provided by our context
  const state = {
    gameState: 'waiting-to-receive-cards',
    lobbyID: 'ABCD',
    players: {
      ID1: {
        name: 'foo',
        score: 0,
        isCzar: false,
        submittedCards: [0, 1],
        cards: ['aaaa', 'bbbb', 'cccc', 'dddd'],
      },
      ID2: {
        name: 'bar',
        score: 0,
        isCzar: true,
        submittedCards: [2],
        cards: [],
      },
      ID3: {
        name: 'baz',
        score: 0,
        isCzar: false,
        submittedCards: [1, 2],
        cards: ['eeee', 'ffff', 'gggg', 'hhhh'],
      },
    },
    selectedBlackCard: {
      text: 'Test Black Card',
      pick: 1,
      pack: 0,
    },
    playerIDs: ['ID1', 'ID2', 'ID3'],
    gameSettings: { maxPlayers: 8, winningScore: 7, selectedPacks: [] },
  };

  describe('rendering', () => {
    it('renders', () => {
      const tree = renderer
        .create(
          <HostContext.Provider value={{ state }}>
            <HostBlackCardScreen />
          </HostContext.Provider>,
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders the black card', () => {
      render(
        <HostContext.Provider value={{ state }}>
          <HostBlackCardScreen />
        </HostContext.Provider>,
      );

      expect(screen.queryByTestId('black-card')).toBeInTheDocument();
    });

    it("renders the czar's name", () => {
      render(
        <HostContext.Provider value={{ state }}>
          <HostBlackCardScreen />
        </HostContext.Provider>,
      );

      expect(screen.queryByTestId('czar-name')).toBeInTheDocument();
      expect(screen.queryByTestId('czar-name')).toHaveTextContent('BAR');
    });
  });
});
