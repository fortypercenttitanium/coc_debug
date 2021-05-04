import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

const propType = {
  loading: PropTypes.bool,
  code: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
};

const defaultProps = {
  loading: false,
  hidden: false,
};

const JoinCodeComponent = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 29px;

  .join-code-title {
    font-size: 18px;
    color: var(--primary-text-color);
    background-color: var(--primary-background-color);
    font-weight: 700;
    width: 97px;
    height: 21px;
  }

  .join-code {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 56px;
    font-weight: bold;
    color: var(--secondary-text-color);
    background-color: var(--secondary-background-color);
    width: 305px;
    height: 70px;
  }
`;

function DisplayJoinCode({ loading, code, hidden }) {
  return (
    <JoinCodeComponent>
      <p className="join-code-title">JOIN CODE:</p>
      <div className="join-code" data-testid="join-code">
        {
          // TODO REMOVE NESTED TERNARY
          // eslint-disable-next-line no-nested-ternary
          loading || !code ? (
            <LoadingIndicator secondary />
          ) : !hidden ? (
            <p>{code}</p>
          ) : null
        }
      </div>
    </JoinCodeComponent>
  );
}

DisplayJoinCode.propTypes = propType;

DisplayJoinCode.defaultProps = defaultProps;

export default DisplayJoinCode;
