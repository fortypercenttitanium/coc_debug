import React, { useContext } from 'react';
import { PlayerContext } from '../../../contexts/PlayerContext/PlayerContext';
import PlayerJoinScreen from '../../screens/PlayerJoinScreen/PlayerJoinScreen';
import PlayerMessageScreen from '../../screens/PlayerMessageScreen/PlayerMessageScreen';

const propTypes = {};

export default function PlayerScreenController() {
  const {
    state: { gameState, message },
  } = useContext(PlayerContext);

  switch (gameState) {
    case 'enter-code':
      return <PlayerJoinScreen />;

    case 'pending-connection':
      return (
        <PlayerMessageScreen
          bigText="Connecting to lobby"
          smallText="Please wait"
        />
      );

    case 'connected':
      return (
        <PlayerMessageScreen bigText={message.big} smallText={message.small} />
      );

    default:
      throw new Error(`Unrecognized game state: ${gameState}`);
  }
}

PlayerScreenController.propTypes = propTypes;
