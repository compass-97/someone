import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Home from './components/Home';
import Signup from './components/Signup';
import Header from './components/Header';
import List from './components/List';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import PersonalInfoAgree from './components/PersonalInfoAgree';

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

a {
  text-decoration: none;
  color: black;
}

ul,li,ol {
  list-style: none;
}

.clearfix{*zoom:1;}
.clearfix:before, .clearfix:after {display: block; content: '';line-height: 0;}
.clearfix:after {clear: both;}

}
`;

const ContainerHeader = styled.div`
  width: 960px;
  margin: 0 auto;
`;
const ContainerHome = styled.div`
  width: 960px;
  height: 950px;
  margin: 0 auto;
`;
const ContainerFooter = styled.div`
  width: 960px;
  margin: 0 auto;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <ContainerHeader>
        <Route component={Header} />
      </ContainerHeader>
      {/* header */}

      <ContainerHome>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/list" component={List} />
          <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
          <Route path="/PersonalInfoAgree" component={PersonalInfoAgree} />
        </Switch>
      </ContainerHome>
      {/* main */}

      <ContainerFooter>
        <Route component={Footer} />
      </ContainerFooter>
    </>
  );
}

export default App;
