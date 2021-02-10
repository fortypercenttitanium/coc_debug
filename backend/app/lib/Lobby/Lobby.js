const { customAlphabet } = require('nanoid');
const Message = require('../Message/Message.js');

const customNanoid = customAlphabet('ABCDGHJKMNPRSTUVWXYZ', 4);

module.exports = class Lobby {
  #hostSocket;
  #playerSockets = {};
  #onClose = () => {};

  constructor(hostSocket, onCloseCallback) {
    this.id = customNanoid();

    hostSocket.on('message', this.#handleHostMessage);
    hostSocket.on('close', this.#handleHostDisconnect);

    this.#hostSocket = hostSocket;

    const message = new Message('server', {
      event: 'create-lobby',
      payload: { id: this.id },
    });

    hostSocket.send(message.toJSON());

    this.#onClose = onCloseCallback;
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
  };

  closeLobby = () => {
    const closeMessage = new Message('server', {
      event: 'lobby-closed',
      payload: {},
    });

    Object.values(this.#playerSockets).forEach((socket) => {
      socket.send(closeMessage.toJSON());
      socket.close(1000, closeMessage.event);
    });

    if (this.#hostSocket) this.#hostSocket.close(1000, closeMessage);
    this.#onClose(this.id);
  };

  #removePlayer = (playerId) => {
    const playerSocket = this.#playerSockets[playerId];
    delete this.#playerSockets[playerSocket.id];
    playerSocket.close(); // This fires the 'close' event, which calls #handlePlayerDisconnect
  };

  #handlePlayerDisconnect = (playerSocket) => (status) => {
    delete this.#playerSockets[playerSocket.id];

    if (status === 1000) return;

    const message = new Message('server', {
      event: 'player-disconnected',
      payload: {
        playerId: playerSocket.id,
      },
    });

    this.#hostSocket.send(message.toJSON());
  };

  #handleHostDisconnect = () => {
    this.closeLobby();
  };

  #handleHostMessage = (rawMessage) => {
    try {
      const message = new Message('host', rawMessage);

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
  };

  // Closure over playerSocket, for callback sent to
  // This arrow function returns another arrow function
  #handlePlayerMessage = (playerSocket) => (rawMessage) => {
    try {
      const message = new Message(playerSocket.id, rawMessage);

      this.#hostSocket.send(message.toJSON());
    } catch (error) {
      // FIXME: eat message if process.env === prod, show if dev
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
};