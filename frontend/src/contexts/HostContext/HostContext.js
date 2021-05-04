import React, { createContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import useReducerMiddleware from '../useReducerMiddleware';
import HostReducer from './HostReducer';
import socketInstance from '../../socket/socket';
import hostReducerMiddleware from './hostReducerMiddleware';
import config from '../../config';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const { emitter } = socketInstance;

const initialState = {
  gameState: 'waiting-for-lobby',
  lobbyID: '',
  players: {},
  playerIDs: [],
  gameSettings: {
    maxPlayers: config.maxPlayers.default,
    winningScore: config.winningScore.default,
    selectedPacks: config.initialSelectedPack,
    handSize: config.handSize,
    winnerScreenDisplayTime: config.winnerScreenDisplayTime,
  },
  deck: { black: [], white: [] },
  loading: [],
  error: {
    hasError: false,
    message: { bigText: '', smallText: '', buttonText: '' },
    errorCallback: '',
  },
};

export const HostContext = createContext();

function HostProvider({ children }) {
  const [state, dispatch] = useReducerMiddleware(
    hostReducerMiddleware,
    HostReducer,
    initialState,
  );

  function handleMessage({ event, payload, sender }) {
    switch (event) {
      case 'player-connected':
        return dispatch({ type: 'PLAYER_CONNECTED', payload });

      case 'player-disconnected':
        return dispatch({ type: 'PLAYER_DISCONNECTED', payload });

      case 'preview-winner':
        return dispatch({ type: 'PREVIEW_WINNER', payload });

      case 'select-winner':
        return dispatch({ type: 'SELECT_WINNER', payload });

      case 'lobby-created':
        return dispatch({ type: 'SET_LOBBY_ID', payload });

      case 'black-card-selected':
        return dispatch({ type: 'SELECT_BLACK_CARD', payload });

      case 'join-code-shuffled':
        return dispatch({ type: 'UPDATE_JOIN_CODE', payload });

      case 'player-submit':
        return dispatch({
          type: 'PLAYER_SUBMIT',
          payload: { ...payload, playerId: sender },
        });

      case 'socket-connection-error':
        dispatch({ type: 'SET_LOBBY_ID', payload: { id: 'ERROR' } });
        return dispatch({
          type: 'SET_ERROR_STATE',
          payload: {
            hasError: true,
            message: {
              bigText: 'Socket error',
              smallText: 'Please try again later',
              buttonText: 'Click anywhere to restart',
            },
            errorCallback: 'RELOAD',
          },
        });

      default:
        return undefined;
    }
  }

  useEffect(() => {
    emitter.on('message', handleMessage);
    return () => {
      emitter.off('message', handleMessage);
    };
  }, []);

  return (
    <HostContext.Provider value={{ state, dispatch }}>
      {children}
    </HostContext.Provider>
  );
}

HostProvider.propTypes = propTypes;

export default HostProvider;
