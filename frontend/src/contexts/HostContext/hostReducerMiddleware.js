import socketInstance from '../../socket/socket';

function closeGame() {
  socketInstance.closeSocket();
}

function createLobby() {
  socketInstance.createLobby();
}

function sendPlayerConnectedMessage(payload) {
  socketInstance.sendMessage({
    event: 'update',
    recipients: [payload.playerId],
    payload: {
      gameState: 'connected',
      message: {
        big: "You've joined the lobby",
        small: 'Please wait for the host to start the game',
      },
    },
  });
}

function sendKickPlayerMessage(payload) {
  socketInstance.sendMessage({
    recipients: [payload.playerId],
    event: 'update',
    payload: {
      message: {
        big: "You've been kicked!",
        small: 'Take off, you hoser!',
      },
    },
  });
}

async function getDeck({ selectedPacks }) {
  const apiURL = process.env.REACT_APP_API_URL;
  const queryString = selectedPacks.join(',');
  const query = `${apiURL}/deck/cards?packs=${queryString}`;
  try {
    const cardsRequest = await fetch(query);
    const cards = await cardsRequest.json();
    return cards;
  } catch {
    throw new Error(`Error fetching cards. Query: ${query}`);
  }
}

export default async function hostReducerMiddleware(
  { type, payload },
  dispatch,
) {
  switch (type) {
    case `CLOSE_GAME`:
      closeGame();
      break;

    case 'CREATE_LOBBY':
      createLobby();
      break;

    case 'PLAYER_CONNECTED':
      sendPlayerConnectedMessage(payload);
      break;

    case 'KICK_PLAYER':
      sendKickPlayerMessage(payload);
      break;

    case 'SET_DECK': {
      const deck = await getDeck(payload);
      return dispatch({
        type: 'SET_DECK',
        payload: { deck },
      });
    }

    default:
      break;
  }
  return dispatch({ type, payload });
}