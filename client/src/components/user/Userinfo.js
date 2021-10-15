import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Userinfowrap = styled.div`display: flex; width: 500px; margin: 0 auto; border: 1px solid #dbdbdb;`;
const Thumbnail = styled.img`width: 100px; height: 100px;`;
const Right = styled.div`width: 400px; height: 100px;`;
const Righttop = styled.div`width: 400px; height: 30px; line-height: 30px;`;
const Nickname = styled.span`font-weight: bold; font-size: 20px; margin-left: 20px;`;
const Age = styled.span`color: gray; font-size: 16px; margin-left: 20px;`;
const Height = styled.span`color: gray; font-size: 16px; margin-left: 20px;`;
const Editbtn = styled.button`padding: 5px 10px; border-radius: 10px; cursor: pointer; margin-left: 20px; border: none; background: none; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;
const Rightmain = styled.div`padding: 10px 20px;`;
const Plusimgsection = styled.div`padding-top: 5px; margin-top: 20px; border-top: 1px solid #dbdbdb;`;
const Plusimg = styled.img` width: 300px; height: 300px; border: 1px solid #ccc; margin: 5px 10px;`;

const Userinfo = ({ history, match }) => {
  const { id } = match.params;
  const [user, setUser] = useState([]);
  const [auth, setAuth] = useState();
  const [plus, setPlus] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST_USER}/auth/${id}`,
    }).then((res) => {
      if (res.data === 'auth') {
        setAuth('auth');
      } else {
        setAuth('noauth');
      }
    }).catch((err) => {
      console.log(err);
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST_USER}/userinfo/${id}`,
    }).then((res) => {
      setUser(user.filter((post) => post.id === -1).concat(res.data));
    }).catch((err) => {
      console.log('err');
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST_USER}/plusinfo/${id}`,
    }).then((res) => {
      setPlus(plus.filter((img) => img.id === -1).concat(res.data));
    }).catch((err) => {
      console.log(err);
    });
  }, [id]);

  return (
    <>
      {user && user[0] && auth
        ? (
          <>
            <Userinfowrap>
              <Thumbnail src={user[0].thumbnail} />
              <Right>
                <Righttop>
                  <Nickname>{user[0].nickname}</Nickname>
                  <Age>{user[0].age}</Age>
                  <Height>{user[0].height}</Height>
                  {auth === 'auth'
                    ? <Editbtn onClick={() => history.push(`/useredit/${id}`)}>정보수정</Editbtn> : null}
                </Righttop>
                <Rightmain>
                  {user[0].intro}
                </Rightmain>
              </Right>
            </Userinfowrap>
            <Plusimgsection>
              {plus.map((img) => <Plusimg src={img.img} />)}
            </Plusimgsection>
          </>
        )
        : null}
    </>
  );
};

export default Userinfo;
