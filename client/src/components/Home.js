import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import qs from 'query-string';
import Pagination from '../api/Pagination';
import GetTotalPage from '../api/GetTotalPage';

const Userlist = styled.ul`height: 900px; border: 1px solid #dbdbdb; padding: 10px; margin-bottom: 20px;`;
const Userinfowrap = styled.div`display: flex; width: 450px; border: 1px solid #dbdbdb;`;
const Thumbnail = styled.img`width: 100px; height: 100px;`;
const Right = styled.div`width: 350px; height: 100px;`;
const Righttop = styled.div`width: 350px; height: 30px; line-height: 30px;`;
const Sex = styled.span`margin-right: 10px; font-size: 14px; font-weight: bold; color: #fff; background: #0080ff; padding: 2px 5px; border-radius: 10px;`;
const Nickname = styled.span`margin-right: 10px; font-weight: bold; font-size: 18px; cursor: pointer;`;
const Age = styled.span`margin-right: 10px; color: gray; font-size: 14px;`;
const Height = styled.span`color: gray; font-size: 14px;`;
const Rightmain = styled.div`padding: 10px 0 5px 20px;`;
const Bottom = styled.div`padding: 0 10px;`;
const Btn = styled.button`font-weight: bold; border: none; background: none; cursor: pointer; padding: 5px 7px; margin-left: 255px; border: 1px solid #dbdbdb; border-radius: 10px; &:hover {background: #0080ff; color: #fff; font-weight: bold;}`;

const Home = ({ history, location }) => {
  let page;
  if (!qs.parse(location.search).page) {
    page = 1;
  } else {
    page = Number(qs.parse(location.search).page);
  }
  const limit = 12;
  const url = '/?page=';
  const [user, setUser] = useState([]);
  const [auth, setAuth] = useState(null);
  const [totalpage, setTotalpage] = useState(null);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST}/home?page=${page}&limit=${limit}`,
    }).then((res) => {
      if (res.data === 'noauth') {
        setAuth('no');
      } else {
        setUser(user.filter((userinfo) => userinfo.id === -1).concat(res.data));
        GetTotalPage(limit).then((total) => setTotalpage(total));
      }
    }).catch((err) => {
      alert(err);
    });
  }, [page]);

  const req = (id) => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_HOST}/req`,
      data: { user_like: id },
    }).then((res) => {
      if (res.data === 'noauth') {
        alert('로그인해주세요');
        window.location.reload();
      } else if (res.data === 'already') {
        alert('취소했습니다.');
        window.location.reload();
      } else if (res.data === 'ok') {
        alert('대화신청완료');
        window.location.reload();
      } else if (res.data === 'good') {
        alert('대화가능합니다');
        window.location.reload();
      }
    }).catch((err) => {
      alert('err');
    });
  };

  return (
    <>
      { auth === 'no'
        ? <p>로그인필요</p>
        : (
          <>
            <Userlist className="clearfix">
              {user.map((userinfo) => (
                <Userinfowrap>
                  <Thumbnail src={userinfo.thumbnail} />
                  <Right>
                    <Righttop>
                      <Sex>{userinfo.sex === 'man' ? '남' : '여'}</Sex>
                      <Nickname onClick={() => history.push(`/userinfo/${userinfo.id}`)}>{userinfo.nickname}</Nickname>
                      <Age>{userinfo.age}</Age>
                      <Height>{userinfo.height}</Height>
                    </Righttop>
                    <Rightmain>{userinfo.intro}</Rightmain>
                    <Bottom><Btn onClick={() => req(userinfo.id)}>대화신청</Btn></Bottom>
                  </Right>
                </Userinfowrap>
              ))}
            </Userlist>
            <div>
              <Pagination totalpage={totalpage} url={url} currentpage={page} />
            </div>
          </>
        )}
    </>
  );
};

export default Home;
