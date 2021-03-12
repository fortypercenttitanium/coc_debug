import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameSettings from './GameSettings';

function setupFetchMock(jsonValue = ['hello', 'world']) {
  jest.spyOn(window, 'fetch').mockImplementation(async () => ({
    json: async () => jsonValue,
  }));
}

describe('GameSettings', () => {
  beforeEach(() => {
    setupFetchMock();
  });

  describe('render', () => {
    it('renders', async () => {
      const onChange = () => {};
      const options = {
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [],
      };

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

      expect(screen.getByText('MAX PLAYERS')).toBeInTheDocument();
      expect(screen.getByText('SELECT CARD PACKS')).toBeInTheDocument();
      expect(screen.getByText('WINNING SCORE')).toBeInTheDocument();
      expect(screen.getByText('GAME SETTINGS')).toBeInTheDocument();
    });

    it('renders with proper values returned by the api request', async () => {
      const onChange = () => {};
      const options = {
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [],
      };

      setupFetchMock(['goodbye', 'cruel', 'world']);

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

      expect(screen.getByText('goodbye')).toBeInTheDocument();
      expect(screen.getByText('cruel')).toBeInTheDocument();
      expect(screen.getByText('world')).toBeInTheDocument();
    });
  });

  describe('options', () => {
    it('renders with the proper value set for maxPlayers', async () => {
      const onChange = () => {};
      const options = {
        maxPlayers: 121,
        winningScore: 6,
        selectedPacks: [],
      };

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
      expect(screen.getByLabelText('MAX PLAYERS')).toHaveValue(121);
    });

    it('renders with the proper value set for winningScore', async () => {
      const onChange = () => {};
      const options = {
        maxPlayers: 5,
        winningScore: 87,
        selectedPacks: [],
      };

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
      expect(screen.getByLabelText('WINNING SCORE')).toHaveValue(87);
    });

    it('renders with the proper boxes checked for selectedPacks', async () => {
      const onChange = () => {};
      const options = {
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [3, 0],
      };

      const mockPacks = [
        'pack-zero',
        'pack-one',
        'pack-two',
        'pack-three',
        'pack-four',
        'pack-five',
      ];

      setupFetchMock(mockPacks);

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

      ['pack-zero', 'pack-three'].forEach((pack) => {
        expect(screen.getByLabelText(pack)).toBeChecked();
      });

      ['pack-one', 'pack-two', 'pack-four', 'pack-five'].forEach((pack) => {
        expect(screen.getByLabelText(pack)).not.toBeChecked();
      });
    });

    it('renders with no boxes checked when selectedPacks is empty', async () => {
      const onChange = () => {};
      const options = {
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [],
      };

      const mockPacks = [
        'pack-zero',
        'pack-one',
        'pack-two',
        'pack-three',
        'pack-four',
        'pack-five',
      ];

      setupFetchMock(mockPacks);

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

      mockPacks.forEach((pack) => {
        expect(screen.getByLabelText(pack)).not.toBeChecked();
      });
    });
  });

  describe('onChange', () => {
    it('runs when MAX PLAYERS is changed and passes the new value back', async () => {
      const onChange = jest.fn();
      const options = {
        maxPlayers: 1,
        winningScore: 6,
        selectedPacks: [],
      };

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

      // Simulate user appending "2"
      userEvent.type(screen.getByLabelText('MAX PLAYERS'), '2');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        maxPlayers: 12,
        winningScore: 6,
        selectedPacks: [],
      });
    });

    it('runs when WINNING SCORE is changed and passes the new value back', async () => {
      const onChange = jest.fn();
      const options = {
        maxPlayers: 5,
        winningScore: 1,
        selectedPacks: [],
      };

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));

      // Simulate user appending "3"
      userEvent.type(screen.getByLabelText('WINNING SCORE'), '3');
      expect(onChange).toHaveBeenCalledTimes(1);

      expect(onChange).toHaveBeenCalledWith({
        maxPlayers: 5,
        winningScore: 13,
        selectedPacks: [],
      });
    });

    it('runs when checkbox is changed', async () => {
      const onChange = jest.fn();
      const options = {
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [],
      };

      setupFetchMock(['pack-one', 'pack-two']);

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
      userEvent.click(screen.getByLabelText('pack-one'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls the callback when the cardPack index in selectedPacks when a pack is checked', async () => {
      const onChange = jest.fn();
      const options = {
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [],
      };

      setupFetchMock(['pack-one', 'pack-two']);

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
      userEvent.click(screen.getByLabelText('pack-one'));
      expect(onChange).toHaveBeenCalledTimes(1);

      expect(onChange).toHaveBeenCalledWith({
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [0],
      });
    });

    it('calls the callback when the cardPack index in selectedPacks when a pack is unchecked', async () => {
      const onChange = jest.fn();
      const options = {
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [1, 0],
      };

      setupFetchMock(['pack-one', 'pack-two']);

      render(<GameSettings onChange={onChange} options={options} />);
      await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
      userEvent.click(screen.getByLabelText('pack-two'));
      expect(onChange).toHaveBeenCalledTimes(1);

      expect(onChange).toHaveBeenCalledWith({
        maxPlayers: 5,
        winningScore: 6,
        selectedPacks: [0],
      });
    });
  });
});