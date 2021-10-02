import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`font-size: 14px; color: gray; font-weight: bold; background: none; border: none; cursor: pointer;`;

const Footer = (props) => (
  <Btn onClick={() => props.history.push('/PrivacyPolicy')} type="button">개인정보처리방침</Btn>
);

export default Footer;
