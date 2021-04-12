import React from 'react';

import HostSettingsMenu from './HostSettingsMenu';
import PlayerKicker from './SettingsSubComponents/PlayerKicker';
import JoinCodeHider from './SettingsSubComponents/JoinCodeHider';
import JoinCodeShuffler from './SettingsSubComponents/JoinCodeShuffler';

export default function PreGameSettingsModal() {
  return (
    <HostSettingsMenu
      settingsComponentList={[JoinCodeHider, PlayerKicker, JoinCodeShuffler]}
    />
  );
}
