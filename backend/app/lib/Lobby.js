import { customAlphabet } from 'nanoid';
import Message from './Message.js';

const customNanoid = customAlphabet('ABCDGHJKMNPRSTUVWXYZ', 4);

export default class Lobby {
  #hostSocket;
  #playerSockets = {};

  constructor(hostSocket) {
    this.id = customNanoid();

    hostSocket.on('message', this.#handleHostMessage);

    this.#hostSocket = hostSocket;
    hostSocket.send(this.id);
  }

  addPlayer = (playerSocket) => {
    // the data from this message is passed into the callback returned from the method in this cb
    playerSocket.on('message', this.#handlePlayerMessage(playerSocket));
    playerSocket.on('close', this.#handlePlayerDisconnect(playerSocket));
    this.#playerSockets[playerSocket.id] = playerSocket;

    const message = new Message('server', {
      event: 'player-connect',
      payload: {
        playerId: playerSocket.id,
      },
    });

    this.#hostSocket.send(message.toJSON());
  }

  #removePlayer = (playerId) => {
    const playerSocket = this.#playerSockets[playerId];
    delete this.#playerSockets[playerSocket.id];
    playerSocket.close(); // This fires the 'close' event, which calls #handlePlayerDisconnect
  }

  #handlePlayerDisconnect = (playerSocket) => () => {
    delete this.#playerSockets[playerSocket.id];

    const message = new Message('server', {
      event: 'player-disconnected',
      payload: {
        playerId: playerSocket.id,
      },
    });

    this.#hostSocket.send(message.toJSON());
  }

  #handleHostMessage = (rawMessage) => {
    try {
      const message = new Message('host');
      message.fromJSON(rawMessage);

      if (message.event === 'kick-player') {
        this.#removePlayer(message.payload.playerId);
      }

      if (message.isForBroadcast) {
        Object.values(this.#playerSockets).forEach((socket) => {
          socket.send(message.toJSON());
        });
      } else {
        message.recipients.forEach((recipient) => {
          const socket = this.#playerSockets[recipient];
          socket.send(message.toJSON());
        });
      }
    } catch (error) {
      // FIXME: eat message if process.env === prod, show if dev
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  // Closure over playerSocket, for callback sent to
  // This arrow function returns another arrow function
  #handlePlayerMessage = (playerSocket) => (rawMessage) => {
    try {
      const message = new Message(playerSocket.id);
      message.fromJSON(rawMessage);

      this.#hostSocket.send(message.toJSON());
    } catch (error) {
      // FIXME: eat message if process.env === prod, show if dev
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}
