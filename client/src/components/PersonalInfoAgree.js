import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`border: 2px solid #dbdbdb; padding: 10px; `;
const Title = styled.p`font-size: 17px; font-weight: bold;`;
const Div = styled.div`margin: 20px 0;`;
const Subtitle = styled.p`font-weight: bold;`;
const Desc = styled.p`padding-left: 10px;`;

const PersonalInfoAgree = () => (
  <Wrap>
    <Title>개인정보수집이용동의서</Title>
    <Div>
      <Subtitle>1. 개인정보 수집/이용목적</Subtitle>
      <Desc>서비스 이용 및 본인인증</Desc>
    </Div>
    <Div>
      <Subtitle>개인정보 수집항목</Subtitle>
      <Desc>-수집항목: 이메일, 로그인ID, 비밀번호, 나이, 성별, 신체정보, 카카오톡아이디</Desc>
    </Div>
    <Div>
      <Subtitle>개인정보의 보유 및 이용기간</Subtitle>
      <Desc>회원일시 보유, 회원탈퇴시 지체없이 파기</Desc>
    </Div>
    <Div>
      <Subtitle>동의 거부 및 동의 거부시 불이익 내용</Subtitle>
      <Desc>개인정보 수집 동의를 거부하실 수 있습니다. 다만, 동의하지 않을 경우 서비스 이용이 불가합니다.</Desc>
      <Desc>서비스 이용에 필요한 개인정보는 다른 목적으로 사용되지 않습니다.</Desc>
    </Div>
  </Wrap>
);

export default PersonalInfoAgree;
