import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Signupwrap = styled.div`width: 300px; margin: 0 auto;`;

const Privacydiv = styled.div`display: flex; justify-content: space-between;`;
const Privacy = styled.span`font-size: 14px; color: gray; font-weight: bold; cursor: pointer;`;

const Title = styled.p`font-size: 20px; font-weight: bold; text-align: center; border: 1px solid #dbdbdb; padding: 10px; margin: 10px 0 20px 0; background: #0080ff; color: #fff; `;

const Input = styled.input`width: 100%; height: 50px; font-size: 17px; padding: 0 10px; border: 1px solid #dbdbdb; margin-bottom : -1px;`;
const Checkpwd = styled.p`width: 100%; hegiht: 30px; font-size: 12px; padding: 3px 10px;`;
const Wrongpwd = styled.p`color: red;`;
const Sex = styled.div`width: 100%;`;
const Label = styled.label`display: inline-block; width: 50%; height: 50px; text-align: center; font-size: 17px; line-height: 50px; color: gray; border: 1px solid #dbdbdb; cursor: pointer;`;
const Radio = styled.input`display: none; &:checked + ${Label} {background: #0080ff; color: #fff; font-weight: bold;}`;
const Maildiv = styled.div`position: relative;`;
const Inputmail = styled.input`width: 230px; height: 50px; font-size:17px; padding: 0 10px; border: 1px solid #dbdbdb;`;
const Mailbtn = styled.button`position: absolute; top: 0; right: 0; width: 70px; height: 50px; font-weight: bold; border: 1px solid #dbdbdb; border-left: none; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff;}`;
const Submitbtn = styled.button`width: 300px; font-size: 17px; font-weight: bold; height: 40px; margin-top: 20px; background: none; border: 1px solid #dbdbdb; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff;}`;

const Signup = (props) => {
  const [data, setData] = useState({
    nickname: '',
    name: '',
    password: '',
    check_password: '',
    email: null,
    height: null,
    intro: null,
    kakao: null,
    sex: null,
    age: null,
  });

  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [auth, setAuth] = useState('noauth');
  const [mailloading, setMailloading] = useState('off');
  const check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{10,}$/;

  const checkpwd = () => {
    if (!check.test(data.password)) {
      return <Wrongpwd>영어,숫자,특수문자를 포함한 10글자이상의 비밀번호를 작성해주세요</Wrongpwd>;
    }
    return <p>안전한 비밀번호</p>;
  };

  const getvalue = (e) => {
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const radio = (sex) => {
    setData({
      ...data,
      sex,
    });
  };
  const handleOnInput = (maxlength) => (e) => {
    if (e.target.value.length > maxlength) {
      e.target.value = e.target.value.substr(0, maxlength);
    }
  };

  const getemail = (e) => {
    setEmail(e.target.value);
  };

  const signup = () => {
    if (window.confirm('회원가입하시겠습니까?')) {
      if (!data.nickname) {
        alert('닉네임을 입력해주세요');
        document.getElementById('nickname').focus();
      } else if (!data.name) {
        alert('아이디를 입력해주세요');
        document.getElementById('name').focus();
      } else if (!data.password) {
        alert('비밀번호를 입력해주세요');
        document.getElementById('password').focus();
      } else if (!check.test(data.password)) {
        alert('안전하지 못한 비밀번호');
      } else if (!data.height) {
        alert('키를 입력해주세요');
        document.getElementById('height').focus();
      } else if (!data.kakao) {
        alert('카카오아이디를 입력해주세요');
        document.getElementById('kakao').focus();
      } else if (!data.intro) {
        alert('자기소개를 입력해주세요');
        document.getElementById('intro').focus();
      } else if (!data.age) {
        alert('나이를 입력해주세요');
        document.getElementById('age').focus();
      } else if (!data.sex) {
        alert('성별을 선택해주세요');
      } else if (data.password !== data.check_password) {
        alert('비밀번호가 일치하지 않습니다.');
        document.getElementById('check_password').focus();
      } else if (auth === 'noauth') {
        alert('이메일인증을 해주세요');
      } else {
        axios({
          method: 'post',
          url: `${process.env.REACT_APP_SERVER_HOST}/signup`,
          data: {
            data,
            token,
          },
        }).then((res) => {
          if (res.data === 'pwdtesterr') {
            alert('안전하지 못한 비밀번호');
          } else if (res.data === 'ok') {
            props.history.push('/?page=1');
          } else if (res.data === 'user_iderr') {
            alert('아이디중복입니다');
            document.getElementById('name').focus();
          } else if (res.data === 'nicknameerr') {
            alert('닉네임중복입니다');
            document.getElementById('nickname').focus();
          } else {
            alert('err');
          }
        }).catch((err) => {
          alert('err');
        });
      }
    }
  };

  const nodemailer = () => {
    if (!email) {
      alert('이메일을 입력해주세요');
    } else {
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_HOST}/signup/nodemailer`,
        data: { email },
      }).then((res) => {
        if (res.data === 'fail') {
          alert('이미 가입된 메일입니다');
        } else {
          setMailloading('on');
          alert('메일전송하였습니다');
        }
      });
    }
  };

  const getauth = (e) => {
    setToken(e.target.value);
  };

  const checkAuth = () => {
    if (auth === 'auth') {
      alert('이미 인증되었습니다');
    } else if (mailloading !== 'on') {
      alert('이메일 인증요청을 해주세요');
    } else if (!token) {
      alert('인증번호를 입력해주세요');
    } else {
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_HOST}/signup/check_auth`,
        data: {
          check_token: token,
          email,
        },
      }).then((res) => {
        if (res.data === 'success') {
          setAuth('auth');
          setData({
            ...data,
            email,
          });
          alert('인증되었습니다');
        } else if (res.data === 'emailerr') {
          alert('이미 가입된 이메일입니다');
        } else {
          setAuth('noauth');
          alert('인증실패');
        }
      });
    }
  };

  return (
    <Signupwrap>
      <Privacydiv>
        <Privacy onClick={() => props.history.push('/PersonalInfoAgree')}>개인정보수집이용동의서</Privacy>
        <Privacy onClick={() => props.history.push('/PrivacyPolicy')}>개인정보처리방침</Privacy>
      </Privacydiv>
      <Title>회원가입</Title>
      <Input type="text" id="nickname" name="nickname" placeholder="닉네임" maxLength="5" onChange={getvalue} />
      <br />
      <Input type="text" id="name" name="name" placeholder="아이디" maxLength="13" onChange={getvalue} />
      <br />
      <Input type="password" id="password" name="password" placeholder="비밀번호" onChange={getvalue} />
      <br />
      <Checkpwd>
        {checkpwd()}
      </Checkpwd>
      <Input type="password" id="check_password" name="check_password" placeholder="비밀번호확인" onChange={getvalue} />
      <br />
      <Input type="text" id="kakao" name="kakao" placeholder="카카오톡아이디" maxLength="13" onChange={getvalue} />
      <br />
      <Input type="number" id="height" name="height" placeholder="키(cm)" onInput={handleOnInput(3)} onChange={getvalue} />
      <br />
      <Input type="number" id="age" name="age" placeholder="나이" onInput={handleOnInput(2)} onChange={getvalue} />
      <br />
      <Sex>
        <Radio type="radio" id="man" name="sex" />
        <Label htmlFor="man" onClick={() => radio('man')}>남자</Label>
        <Radio type="radio" id="woman" name="sex" />
        <Label htmlFor="woman" onClick={() => radio('woman')}>여자</Label>
      </Sex>
      <Input type="text" id="intro" name="intro" placeholder="자기소개(10글자)" maxLength="10" onChange={getvalue} />
      <br />
      <Maildiv>
        <Inputmail type="text" onChange={getemail} placeholder="example@naver.com" />
        {mailloading === 'off'
          ? <Mailbtn onClick={nodemailer}>인증 요청</Mailbtn>
          : <Mailbtn>인증 요청</Mailbtn>}
      </Maildiv>
      <Maildiv>
        <Inputmail type="number" onChange={getauth} onInput={handleOnInput(6)} placeholder="123456" />
        <Mailbtn onClick={checkAuth}>인증 확인</Mailbtn>
      </Maildiv>
      <Submitbtn onClick={signup}>약관을 동의하며 회원가입</Submitbtn>
    </Signupwrap>
  );
};

export default Signup;
