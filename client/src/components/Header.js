import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Headerwrap = styled.div`display: flex; align-items: center; height: 100px; margin-top: 20px; margin-bottom: 10px; border: 1px solid #dbdbdb;`;
const Logo = styled.h1`margin-left: 20px; cursor: pointer;`;
const Signup = styled.button`margin-left: 50px; border: none; font-size: 15px; font-weight: bold; background: none; cursor: pointer; transition: all .1s ease; &:hover {color: #0080ff; font-weight: bold;}`;

const Userwrap = styled.div`position: relative; height: 30px; border: 1px solid #dbdbdb; margin-top: -2px; margin-bottom: 50px;`;
const Inputid = styled.input`position: absolute; top: 0; left: 0; width: 200px; padding: 0 10px; font-size: 15px; height: 30px; border: 1px solid #dbdbdb;`;
const Inputpwd = styled.input`position: absolute; top: 0; left: 200px; width: 200px; height: 30px; padding: 0 10px; font-size: 15px; border: 1px solid #dbdbdb;`;
const Loginbtn = styled.button`position: absolute; top: 0; left: 400px; width: 70px; height: 30px; padding: 0 10px; font-size: 15px; border: 1px solid #dbdbdb; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;

const Username = styled.span`height: 30px; margin-left: 30px; font-size: 20px; font-weight: bold;`;
const Userlike = styled.button`width: 50px; margin-left: 20px; height: 30px; font-size: 15px; border: none; background: none; cursor: pointer; transition: all .1s ease; &:hover {color: #0080ff;}`;
const Useredit = styled.button`position: absolute; top: 0; right: 160px; width: 80px; height: 30px; font-size: 15px; border: none; border-left: 1px solid #dbdbdb; background: none; cursor: pointer; transition: all .1s ease; &:hover { background: #0080ff; color: #fff; font-weight: bold;}`;
const Withtbtn = styled.button`position: absolute; top: 0; right: 80px; width: 80px; height: 30px; font-size: 15px; border: none; border-left: 1px solid #dbdbdb; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;
const Logoutbtn = styled.button`position: absolute; top: 0; right: 0; width: 80px; height: 30px; font-size: 15px;; border: none; border-left: 1px solid #dbdbdb; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;

const Header = (props) => {
  const [login, setLogin] = useState({
    user_id: '',
    password: '',
  });
  const [user, setUser] = useState({
    id: null,
    nickname: null,
  });

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST}/auth`,
    }).then((res) => {
      if (res.data !== 'noauth') {
        setUser({
          ...user,
          id: res.data.id,
          nickname: res.data.nickname,
        });
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
      alert('??????????????? ??????????????????');
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
    if (window.confirm('???????????????????????????????')) {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_SERVER_HOST}/withdrawal`,
      }).then((res) => {
        props.history.push('/?page=1');
        window.location.reload();
      });
    }
  };

  const edit = () => {
    console.log('hi');
  };

  return (
    <>
      <Headerwrap>
        <Logo onClick={() => props.history.push('/?page=1')}>?????????</Logo>
        {user.id === null ? <Signup onClick={() => props.history.push('/signup')}>????????????</Signup>
          : null}
      </Headerwrap>
      <Userwrap>
        {user.id === null
          ? (
            <>
              <Inputid type="text" name="user_id" placeholder="?????????" onChange={getvalue} />
              <Inputpwd type="password" name="password" placeholder="????????????" onChange={getvalue} />
              <Loginbtn onClick={loginhandler}>?????????</Loginbtn>
            </>
          )
          : (
            <>
              <Username>{user.nickname}</Username>
              <Userlike onClick={() => props.history.push('/list')}>??????</Userlike>
              <Useredit onClick={() => props.history.push(`/userinfo/${user.id}`)}>?????????</Useredit>
              <Withtbtn onClick={withdrawal}>????????????</Withtbtn>
              <Logoutbtn onClick={logout}>????????????</Logoutbtn>
            </>
          )}
      </Userwrap>
    </>
  );
};

export default Header;
