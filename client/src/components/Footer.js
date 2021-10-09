import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`height: 100px;`;
const Btn = styled.button`font-size: 14px; color: gray; font-weight: bold; background: none; border: none; cursor: pointer;`;

const Footer = (props) => (
  <Wrap>
    <Btn onClick={() => props.history.push('/PrivacyPolicy')} type="button">개인정보처리방침</Btn>
  </Wrap>
);

export default Footer;
