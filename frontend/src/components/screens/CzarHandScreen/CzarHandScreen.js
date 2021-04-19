import React, { useContext, useState } from 'react';
import { PlayerContext } from '../../../contexts/PlayerContext/PlayerContext';

import CardHandLayout from '../../CardHandLayout/CardHandLayout';
import CzarHand from '../../CzarHand/CzarHand';

export default function CzarHandScreen() {
  const { state, dispatch } = useContext(PlayerContext);
  const [selection, setSelection] = useState(null);

  const submit = () => {
    dispatch({ type: 'SUBMIT_WINNER', payload: { id: selection } });
  };

  const submitPreview = (selectedIndex, selectedPlayerId) => {
    setSelection(selectedIndex);

    dispatch({
      type: 'PREVIEW_WINNER',
      payload: { highlightedPlayerID: selectedPlayerId },
    });
  };

  return (
    <CardHandLayout
      onClear={() => setSelection(null)}
      onSubmit={submit}
      title={{
        top: "YOU'RE THE CZAR,",
        bottom: 'PICK A WINNER',
      }}
    >
      <CzarHand
        cardsData={state.submittedCards}
        selectedGroup={selection}
        onSelect={submitPreview}
      />
    </CardHandLayout>
  );
}
