import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Footer from './Footer/Footer';

const propTypes = {
  isWelcoming: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  isWelcoming: false,
};

const Header = styled.header`
  width: 100%;
  background-color: var(--secondary-background-color);
  color: var(--secondary-text-color);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: min(25.6vh, 420px);

  .welcome-to {
    font-size: clamp(28px, 2.6vw, 66px);
    font-weight: 500;
    line-height: 100%;
    margin-bottom: max(-0.8vw, -18px);
  }
  .CoC {
    font-size: clamp(48px, 7vw, 175px);
    font-weight: 700;
    line-height: 100%;
    margin-bottom: max(-1.1vw, -30px);
    padding-right: 5px;
  }

  @media (max-width: 600px) {
    .CoC {
      margin-bottom: -7px;
    }
  }

  @media (max-width: 490px), (orientation: landscape) and (max-height: 500px) {
    .welcome-to {
      display: none;
    }
  }
`;

function HeaderFooterLayout({ isWelcoming, children }) {
  return (
    <>
      <Header>
        {isWelcoming && <p className="welcome-to">WELCOME TO</p>}
        <h1 className="CoC">CARDS OF CAROUSAL</h1>
      </Header>
      {children}
      <Footer isWelcoming={isWelcoming} />
    </>
  );
}

HeaderFooterLayout.propTypes = propTypes;
HeaderFooterLayout.defaultProps = defaultProps;

export default HeaderFooterLayout;
