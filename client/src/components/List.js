import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Listlike = styled.div``;
const Title = styled.p`font-size: 17px; font-weight: bold; border-bottom: 2px solid #dbdbdb; padding-bottom: 10px;`;

const Userlist = styled.ul`margin-bottom: 20px;`;
const User = styled.li`float: left; width: 270px; height: 160px; margin: 20px 20px 20px 0; border: 1px solid #dbdbdb; &:last-child {margin-right: 0;}`;
const Top = styled.div`padding: 0 10px; line-height: 39px; height: 39px;`;
const Sex = styled.span`margin-right: 10px; font-size: 14px; font-weight: bold; color: #fff; background: #0080ff; padding: 2px 5px; border-radius: 10px;`;
const Nickname = styled.span`margin-right: 10px; font-weight: bold; font-size: 18px;`;
const Age = styled.span`margin-right: 10px; color: gray; font-size: 14px;`;
const Height = styled.span`color: gray; font-size: 14px;`;
const Mid = styled.div`padding: 0 10px 0 20px; height: 70px; line-height: 70px;`;
const Kakaobtn = styled.button`border: 1px solid #dbdbdb; border-radius: 10px; background: none; padding: 5px 10px; font-weight: bold; font-size: 17px; cursor: pointer; transition: all .2s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;
const Kakao = styled.p`padding: 5px 10px; font-weight: bold; font-size: 17px;`;
const Bottom = styled.div`padding: 0 10px; line-height: 49px; height: 49px;`;
const Btn = styled.button`border: none; background: none; cursor: pointer; padding: 5px 7px; margin-left: 175px; border: 1px solid #dbdbdb; border-radius: 10px; transition: all .1s ease; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;

const List = () => {
  const [yes, setYes] = useState([]);
  const [listilike, setListilike] = useState([]);
  const [listsomeonelike, setListsomeonelike] = useState([]);
  const [auth, setAuth] = useState(null);
  const [kakao, setKakao] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST}/listyes`,
    }).then((res) => {
      if (res.data !== 'none') setYes(yes.concat(res.data));
    }).catch((err) => {
      alert('err');
    });
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST}/listilike`,
    }).then((res) => {
      if (res.data !== 'none') setListilike(listilike.concat(res.data));
    }).catch((err) => {
      alert('err');
    });
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST}/listsomeonelike`,
    }).then((res) => {
      if (res.data === 'noauth') {
        setAuth('no');
      } else if (res.data !== 'none') {
        setListsomeonelike(listsomeonelike.concat(res.data));
      }
    }).catch((err) => {
      alert('err');
    });
  }, []);

  const resHandler = (id) => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_HOST}/res`,
      data: { user_someone: id },
    }).then((res) => {
      if (res.data === 'noauth') {
        alert('?????????????????????');
        window.location.reload();
      } else if (res.data === 'ok') {
        alert('???????????????????????? ???????????????');
        window.location.reload();
      } else if (res.data === 'cancel') {
        alert('?????????????????????');
        window.location.reload();
      }
    }).catch((err) => {
      alert('err');
    });
  };

  const reqHandler = (id) => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_HOST}/req`,
      data: { user_like: id },
    }).then((res) => {
      if (res.data === 'noauth') {
        alert('?????????????????????');
        window.location.reload();
      } else if (res.data === 'already') {
        alert('??????????????????.');
        window.location.reload();
      } else if (res.data === 'ok') {
        alert('??????????????????');
        window.location.reload();
      } else if (res.data === 'good') {
        alert('?????????????????????');
        window.location.reload();
      }
    }).catch((err) => {
      alert('err');
    });
  };

  const kakaohandler = (id) => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_HOST}/kakao`,
      data: { id },
    }).then((res) => {
      const obj = {
        id,
        kakao: res.data,
      };
      setKakao(kakao.concat(obj));
    });
  };

  const kakaodiv = (userid) => (
    kakao && kakao.map((userkakao) => (userkakao.id === userid
      ? <Kakao>{userkakao.kakao}</Kakao> : null)));

  const hidebtn = (userid) => {
    document.getElementById(userid).style.display = 'none';
  };
  return (
    <>
      {auth === 'no'
        ? <p>?????????????????????</p>
        : (
          <>
            <Listlike>
              <Title>?????? ??????</Title>
              <Userlist className="clearfix">
                {yes.map((user) => (
                  <User key={user.id}>
                    <Top>
                      <Sex>{user.sex === 'man' ? '???' : '???'}</Sex>
                      <Nickname>{user.nickname}</Nickname>
                      <Age>{user.age}</Age>
                      <Height>{user.height}</Height>
                    </Top>
                    <Mid>
                      {kakaodiv(user.id)}
                      <Kakaobtn
                        id={user.id}
                        onClick={() => { kakaohandler(user.id); hidebtn(user.id); }}
                      >
                        ?????? ID
                      </Kakaobtn>
                    </Mid>
                    <Bottom><Btn onClick={() => resHandler(user.id)}>????????????</Btn></Bottom>
                  </User>
                ))}
              </Userlist>
            </Listlike>
            <Listlike>
              <Title>?????? ??????</Title>
              <Userlist className="clearfix">
                {listsomeonelike.map((user) => (
                  <User key={user.id}>
                    <Top>
                      <Nickname>{user.nickname}</Nickname>
                      <Age>{user.age}</Age>
                      <Height>{user.height}</Height>
                    </Top>
                    <Mid>{user.intro}</Mid>
                    <Bottom><Btn onClick={() => resHandler(user.id)}>????????????</Btn></Bottom>
                  </User>
                ))}
              </Userlist>
            </Listlike>
            <Listlike>
              <Title>?????? ??????</Title>
              <Userlist className="clearfix">
                {listilike.map((user) => (
                  <User key={user.id}>
                    <Top>
                      <Nickname>{user.nickname}</Nickname>
                      <Age>{user.age}</Age>
                      <Height>{user.height}</Height>
                    </Top>
                    <Mid>{user.intro}</Mid>
                    <Bottom><Btn onClick={() => reqHandler(user.id)}>????????????</Btn></Bottom>
                  </User>
                ))}
              </Userlist>
            </Listlike>
          </>
        )}
    </>
  );
};

export default List;
