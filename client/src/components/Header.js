import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Headerwrap = styled.div`display: flex; align-items: center; height: 100px; margin-top: 20px; border: 2px solid #dbdbdb;`;
const Logo = styled.h1`margin-left: 20px; cursor: pointer;`;
const Signup = styled.button`margin-left: 50px; border: none; font-size: 15px; font-weight: bold; background: none; cursor: pointer; transition: all .1s ease; &:hover {color: #0080ff; font-weight: bold;}`;

const Userwrap = styled.div`position: relative; height: 30px; border: 1px solid #dbdbdb; margin-top: -2px; margin-bottom: 50px;`;
const Inputid = styled.input`position: absolute; top: 0; left: 0; width: 200px; padding: 0 10px; font-size: 15px; height: 30px; border: 1px solid #dbdbdb;`;
const Inputpwd = styled.input`position: absolute; top: 0; left: 200px; width: 200px; height: 30px; padding: 0 10px; font-size: 15px; border: 1px solid #dbdbdb;`;
const Loginbtn = styled.button`position: absolute; top: 0; left: 400px; width: 70px; height: 30px; padding: 0 10px; font-size: 15px; border: 1px solid #dbdbdb; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;

const Username = styled.span`height: 30px; margin-left: 30px; font-size: 17px; font-weight: bold;`;
const Userlike = styled.button`width: 50px; margin-left: 20px; height: 30px; font-size: 15px; border: none; background: none; cursor: pointer; transition: all .1s ease; &:hover {color: #0080ff;}`;
const Withtbtn = styled.button`position: absolute; top: 0; right: 80px; width: 80px; height: 30px; font-size: 15px; border: 1px solid #dbdbdb; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;
const Logoutbtn = styled.button`position: absolute; top: 0; right: 0; width: 80px; height: 30px; font-size: 15px; border: 1px solid #dbdbdb; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;

const Header = (props) => {
  const [login, setLogin] = useState({
    user_id: '',
    password: '',
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST}/auth`,
    }).then((res) => {
      if (res.data !== 'noauth') {
        setUser(res.data.nickname);
      } else {
        setUser('noauth');
      }
    }).catch((err) => {
      alert(err);
    });
  }, []);

  const getvalue = (e) => {
    const { value, name } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const loginhandler = () => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_HOST}/login`,
      data: {
        name: login.user_id,
        password: login.password,
      },
    }).then((res) => {
      props.history.push('/?page=1');
      window.location.reload();
    }).catch((err) => {
      alert('회원정보가 맞지않습니다');
    });
  };

  const logout = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST}/logout`,
    }).then((res) => {
      window.location.reload();
    }).catch((err) => {
      alert(err);
    });
  };

  const withdrawal = () => {
    if (window.confirm('회원탈퇴하시겠습니까?')) {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_SERVER_HOST}/withdrawal`,
      }).then((res) => {
        props.history.push('/?page=1');
        window.location.reload();
      });
    }
  };

  return (
    <>
      <Headerwrap>
        <Logo onClick={() => props.history.push('/?page=1')}>항붕이</Logo>
        {user === 'noauth' ? <Signup onClick={() => props.history.push('/signup')}>회원가입</Signup>
          : null}
      </Headerwrap>
      <Userwrap>
        {user === 'noauth'
          ? (
            <>
              <Inputid type="text" name="user_id" placeholder="아이디" onChange={getvalue} />
              <Inputpwd type="password" name="password" placeholder="비밀번호" onChange={getvalue} />
              <Loginbtn onClick={loginhandler}>로그인</Loginbtn>
            </>
          )
          : (
            <>
              <Username>{user}</Username>
              <Userlike onClick={() => props.history.push('/list')}>목록</Userlike>
              <Withtbtn onClick={withdrawal}>회원탈퇴</Withtbtn>
              <Logoutbtn onClick={logout}>로그아웃</Logoutbtn>
            </>
          )}
      </Userwrap>
    </>
  );
};

export default Header;
