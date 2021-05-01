function joinLobby(state) {
  return {
    ...state,
    gameState: 'pending-connection',
    message: {
      big: 'Connecting to Lobby',
      small: 'Please wait',
    },
    loading: [...state.loading, 'joining-lobby'],
  };
}

function submitCards(state) {
  return {
    ...state,
    gameState: 'submitting-cards',
    message: {
      big: 'Submitting your cards',
      small: 'Please wait',
    },
    loading: [...state.loading, 'submitting-cards'],
  };
}

function update(state, payload) {
  const { removeLoading, ...newData } = payload;
  return {
    ...state,
    ...newData,
    loading: removeLoading
      ? state.loading.filter((loadingVal) => loadingVal !== removeLoading)
      : state.loading,
  };
}

function errorDisconnect(state) {
  return {
    ...state,
    gameState: 'disconnected-error',
    message: {
      big: 'AN ERROR OCCURRED',
      small: 'Refresh to try again',
    },
  };
}

function receiveWhiteCards(state, payload) {
  const { cards, selectCardCount, shouldPreserveGameState } = payload;
  const gameState = shouldPreserveGameState ? state.gameState : 'player-select';

  return {
    ...state,
    gameState,
    cards,
    selectCardCount,
  };
}

function lobbyClosed(state) {
  return {
    ...state,
    gameState: 'lobby-closed',
    message: {
      big: 'THE LOBBY HAS BEEN CLOSED',
      small: "You don't have to go home, but you can't stay here",
    },
  };
}

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'JOIN_LOBBY':
      return joinLobby(state);

    case 'UPDATE':
      return update(state, payload);

    case 'ERROR_DISCONNECT':
      return errorDisconnect(state);

    case 'SUBMIT_CARDS':
      return submitCards(state);

    case 'RECEIVE_WHITE_CARDS':
      return receiveWhiteCards(state, payload);

    case 'LOBBY_CLOSED':
      return lobbyClosed(state);

    default:
      return { ...state };
  }
}

export default reducer;
