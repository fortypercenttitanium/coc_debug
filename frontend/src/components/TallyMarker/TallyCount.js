import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TallyGroup from './TallyGroup';

const propTypes = {
  score: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary']).isRequired,
};

const Container = styled.div`
  display: flex;
`;

const Text = styled.span`
  color: ${(props) =>
    props.color === 'primary'
      ? 'var(--primary-text-color)'
      : 'var(--secondary-text-color)'};
  font-size: 24px;
  font-weight: 900;
`;

function TallyCount({ score, color }) {
  const displayAsText = score > 10;

  return (
    <Container>
      {displayAsText && <Text>{score}</Text>}

      {!displayAsText && score <= 5 && (
        <TallyGroup tallyCount={score} color={color} />
      )}

      {!displayAsText && score > 5 && (
        <>
          <TallyGroup tallyCount={5} color={color} />
          <TallyGroup tallyCount={score - 5} color={color} />
        </>
      )}
    </Container>
  );
}

TallyCount.propTypes = propTypes;

export default TallyCount;
