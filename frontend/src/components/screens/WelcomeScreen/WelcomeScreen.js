import React from 'react';
import styled from 'styled-components';
import Header from '../../Header/Header';
import Button from '../../Buttons/Button';
import Footer from '../../Footer/Footer';

const WelcomeScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: var(--primary-background-color);

  .header {
    height: 190px;
  }

  .header-text {
    position: relative;
    bottom: -122px;
  }

  .welcome-to {
    font-size: 2rem;
    line-height: 0.2rem;
    font-weight: 500;

    margin-top: 0px;
    margin-bottom: -14px;
  }

  .CoC {
    font-size: 5rem;
    line-height: 6.8rem;
    font-weight: 700;

    margin-bottom: -5px;
    vertical-align: bottom;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
  }

  .definition-container {
    display: flex;
    flex-direction: column;

    font-size: 3rem;
    font-weight: 700;
    line-height: 2rem;

    transform: rotate(-5deg);
    margin-bottom: 90px;
  }

  .definition {
    font-size: 2rem;
    font-weight: 400;
  }

  .definition-container p {
    display: inline-block;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 6rem;
    font-weight: 900;

    width: 256px;
    height: 48px;

    font-size: 2.5rem;
  }

  .OR {
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: var(--secondary-background-color);
    color: var(--secondary-text-color);

    border-radius: 50%;
    padding: 16px;

    font-size: 2.25rem;
    font-weight: 700;

    width: 72px;
    height: 72px;
    margin-left: 93px;
    margin-right: 93px;    
  }

  /*if less than 890px do this.... */
  @media (max-width: 820px) {
    .header-text {
      bottom: -134px;
    }

    .welcome-to {
      font-size: 1.5rem;
    }

    .CoC {
      font-size: 4rem;
      line-height: 6rem;
    }

    .definition-container {
      font-size: 2.2rem;
      line-height: 1.8rem;

      margin-bottom: 90px;
    }

    .definition {
      font-size: 1.7rem;
    }

    .btn {
      width: 200px;
      height: 48px;

      font-size: 2.5rem;
    }

    .OR {
      width: 60px;
      height: 60px;
      margin-left: 70px;
      margin-right: 70px;

      font-size: 2rem;
    }
  }

  /*if less than 700px do this.... */
  @media (max-width: 645px) {
     .header-text {
      bottom: -85px;
    }

    .definition-container {
      display: none;
    }

    .host-btn {
      display: none;
    }

    .OR {
      display: none;
    } 

    .welcome-to {
      display: none;
    }

      .CoC {
      line-height: 3.5rem;
    }
  }

  /*if less than 320px do this.... */
  @media (max-width: 320px) {
   .header {
      height: 130px;
    }

    .header-text {
      bottom: -30px;
    }

    .CoC {
      font-size: 3rem;
      margin-bottom: 12px;
    } 
  }

  /*If greater than 2000px wide OR greater than 1500px tall */
  @media (min-width: 2000px), (min-height: 1500px) {
    .header {
      height: 400px;
    }
    .header-text {
      bottom: -260px;
    }

    .welcome-to {
      font-size: 3rem;
      line-height: 3.8rem;
    }

    .CoC {
      font-size: 8rem;
      line-height: 6.5rem;
    }

    .definition-container {
      font-size: 4.5rem;
      line-height: 3.5rem;
      margin-bottom: 250px;
    }

    .definition {
      font-size: 3.5rem;
    }

    .OR {
      font-size: 2.5rem;

      width: 100px;
      height: 100px;
      margin-left: 100px;
      margin-right: 100px;
    }

    .btn {
      width: 500px;
      height: 100px;
      border: solid black 4px;
      font-size: 3rem;
    }
  }
  

  /*if greater than 2450px do this.... */
  @media (min-width: 2450px) {
    .header {
      height: 400px;
    }

    .header-text {
      bottom: -260px;
    }

    .welcome-to {
      font-size: 3rem;
      line-height: 3.8rem;
    }

    .CoC {
      font-size: 8rem;
      line-height: 6.5rem;
    }


    .definition-container {
      font-size: 6.5rem;
      line-height: 5.5rem;
      margin-bottom: 300px;
    }

    .definition {
      font-size: 6rem;
    }

    .OR {
      font-size: 4.5rem;

      width: 150px;
      height: 150px;
      margin-left: 120px;
      margin-right: 120px;
    }

    .btn {
      width: 600px;
      height: 150px;
      border: solid black 4px;
      font-size: 5rem;
    }
  } 
}`;

function WelcomeScreen() {
  return (
    <WelcomeScreenWrapper className="primary-background">
      <Header className="header">
        <div className="header-text">
          <p className="welcome-to">WELCOME TO</p>
          <h1 className="CoC">CARDS OF CAROUSAL</h1>
        </div>
      </Header>
      <main>
        <div className="definition-container">
          <p className="word">
            CAROUSAL <span className="definition">(n)</span>
          </p>
          <p className="definition">
            a wild, drunken party or celebration : a drunken revel
          </p>
        </div>

        <div className="button-container">
          <Button type="button" isActive className="btn">
            <p>JOIN</p>
          </Button>

          <div className="OR">OR</div>

          <Button type="button" isActive className="btn host-btn">
            <p>HOST</p>
          </Button>
        </div>
      </main>
      <Footer />
    </WelcomeScreenWrapper>
  );
}

export default WelcomeScreen;
