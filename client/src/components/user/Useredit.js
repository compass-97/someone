import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Userinfowrap = styled.div`display: flex; width: 505px; height: 135px; margin: 0 auto; border: 1px solid #dbdbdb;`;
const Left = styled.div`padding: 5px 0 0 5px;`;
const Thumbnail = styled.img`width: 105px; height: 100px;`;
const Thumbnailhandler = styled.div`width: 105px; height: 30px; text-align: center;`;
const Thumbnailinput = styled.input`display: none;`;
const Thumbnaillabel = styled.label`font-size: 14px; cursor: pointer;`;
const Right = styled.div`width: 400px; height: 135px;`;
const Righttop = styled.div`width: 400px; height: 45px; line-height: 35px;`;
const Nickname = styled.input`font-size: 16px; background: none; border: 1px solid #ccc; border-radius: 3px; padding: 3px 10px; margin-left: 20px;`;
const Age = styled.span`color: gray; font-size: 16px; margin-left: 20px;`;
const Height = styled.span`color: gray; font-size: 16px; margin-left: 20px;`;
const Rightmain = styled.div`height: 50px; line-height: 40px;`;
const Rightmaininput = styled.input`width: 360px; font-size: 16px; padding: 10px 10px; background: none; border: 1px solid #ccc; border-radius: 3px; margin: 0px 0px 0px 20px;`;
const Rightbottom = styled.div`position: relative; height: 40px;`;
const Plusimgsection = styled.div`padding-top: 5px; margin-top: 20px; border-top: 1px solid #dbdbdb;`;
const Plusimg = styled.img`width: 300px; height: 300px; border: 1px solid #ccc; margin: 5px 10px; cursor: pointer;`;
const Plusimginput = styled.input`display: none;`;
const Plusimglabel = styled.label`display: block; width: 300px; height: 300px; border: 1px solid #ccc; cursor: pointer; margin: 5px 10px;`;
const Savebtn = styled.button`position: absolute; top: 10px; right: 20px; font-weight: bold; font-size: 16px; padding: 2px 5px; border: none; border-radius: 3px; background: none; cursor: pointer; transition: all .1s ease; &:hover {background: #0080ff; color: #fff;}`;

const Useredit = ({ history, match }) => {
  const { id } = match.params;
  const [user, setUser] = useState({
    thumbnail: null,
    age: null,
    height: null,
    intro: null,
    nickname: null,
    sex: null,
    plusimg: null,
  });
  const [plus, setPlus] = useState([]);
  const [auth, setAuth] = useState();

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
      setUser({
        ...user,
        thumbnail: res.data[0].thumbnail,
        age: res.data[0].age,
        height: res.data[0].height,
        intro: res.data[0].intro,
        nickname: res.data[0].nickname,
        sex: res.data[0].sex,
      });
    }).catch((err) => {
      console.log('err');
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_HOST_USER}/plusinfo/${id}`,
    }).then((res) => {
      setPlus(plus.concat(res.data));
    }).catch((err) => {
      console.log('err');
    });
  }, [id]);

  const edit = (e) => {
    const { value, name } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const imagehandler = (e) => {
    const image = e.target.files[0];
    const imageFD = new FormData();
    imageFD.append('image', image);
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_HOST_USER}/upload`,
      data: imageFD,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then((res) => {
      console.log(res.data);
      setUser({
        ...user,
        thumbnail: res.data,
      });
    }).catch((err) => {
      alert('upload err');
    });
  };

  const imagehandler2 = (e) => {
    const image = e.target.files[0];
    const imageFD = new FormData();
    imageFD.append('image', image);
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_HOST_USER}/upload`,
      data: imageFD,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then((res) => {
      console.log(res.data);
      setUser({
        ...user,
        plusimg: res.data,
      });
    }).catch((err) => {
      alert('upload err');
    });
  };

  const deleteimg = (imgId) => {
    if (window.confirm('삭제하시겠습니까?')) {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_SERVER_HOST_USER}/deleteplusimg/${imgId}/${id}`,
      }).then((res) => {
        alert('삭제되었습니다');
        setPlus(plus.filter((img) => img.id !== imgId));
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const save = () => {
    if (window.confirm('저장하시겠습니까?')) {
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_HOST_USER}/edit/${id}`,
        data: user,
      }).then((res) => {
        if (res.data === 'success') {
          alert('저장되었습니다');
          history.push(`/userinfo/${id}`);
        } else if (res.data === 'noauth') {
          alert('권한이 없습니다');
        }
      }).catch((err) => {
        console.log('err');
      });
    }
  };

  return (
    <>
      {user && auth === 'auth'
        ? (
          <>
            <Userinfowrap>
              <Left>
                <Thumbnail src={user.thumbnail} />
                <Thumbnailhandler>
                  <Thumbnailinput type="file" accept="image/*" onChange={imagehandler} id="thumbnail" />
                  <Thumbnaillabel htmlFor="thumbnail">프로필</Thumbnaillabel>
                </Thumbnailhandler>
              </Left>
              <Right>
                <Righttop>
                  <Nickname type="text" name="nickname" placeholder="닉네임" maxLength="10" value={user.nickname} onChange={edit} />
                  <Age>{user.age}</Age>
                  <Height>{user.height}</Height>
                </Righttop>
                <Rightmain>
                  <Rightmaininput type="text" name="intro" placeholder="자기소개" maxLength="20" value={user.intro} onChange={edit} />
                </Rightmain>
                <Rightbottom>
                  <Savebtn type="button" onClick={save}>저장</Savebtn>
                </Rightbottom>
              </Right>
            </Userinfowrap>
            <Plusimgsection>
              {plus
                ? plus.map((img) => <Plusimg src={img.img} onClick={() => deleteimg(img.id)} />)
                : null}
              {user.plusimg ? <Plusimg src={user.plusimg} />
                : (
                  <>
                    <Plusimginput type="file" accept="image/*" id="plusimg" onChange={imagehandler2} />
                    <Plusimglabel htmlFor="plusimg">이미지추가</Plusimglabel>
                  </>
                )}
            </Plusimgsection>
          </>
        )
        : (
          <>
            <p>로그인이 필요합니다</p>
          </>
        )}
    </>
  );
};

export default Useredit;
