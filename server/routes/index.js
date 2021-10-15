const express = require('express');

const router = express();
const bcrypt = require('bcrypt');
const Transport = require('../config/email');
const db = require('../db/meeting');
const passport = require('../lib/passport')(router);

router.post('/signup', (req, res) => {
  const { data } = req.body;
  const { token } = req.body;
  const sql = 'insert into user (nickname,user_id,password,email,height,kakao,intro,age,sex) values (?,?,?,?,?,?,?,?,?)';
  const sqlSignupAuth = 'select signed from signup_auth where useremail = ? and token = ?';
  const sqlCheckid = 'select user_id from user where user_id = ?';
  const sqlChecknickname = 'select nickname from user where nickname = ?';
  const check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{10,}$/;
  if (!check.test(data.password)) {
    console.log('pwd test err');
    res.send('pwdtesterr');
  } else {
    db.query(sqlSignupAuth, [data.email, token], (errSqlSignupAuth, resultSqlSignupAuth) => {
      if (errSqlSignupAuth) throw errSqlSignupAuth;
      if (resultSqlSignupAuth[0].signed === 'ok') {
        db.query(sqlChecknickname, [data.nickname], (errSqlChecknickname, resultSqlChecknickname) => {
          if (errSqlChecknickname) throw errSqlChecknickname;
          if (resultSqlChecknickname.length > 0) {
            res.send('nicknameerr');
          } else {
            db.query(sqlCheckid, [data.name], (errSqlCheckid, resultSqlChecked) => {
              if (errSqlCheckid) throw errSqlCheckid;
              if (resultSqlChecked.length > 0) {
                res.send('user_iderr');
              } else {
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(data.password, salt, (errHash, hash) => {
                    db.query(sql, [data.nickname, data.name, hash, data.email, data.height, data.kakao, data.intro, data.age, data.sex], (errSql) => {
                      if (errSql) throw errSql;
                      console.log('newuser');
                      res.send('ok');
                    });
                  });
                });
              }
            });
          }
        });
      } else {
        res.send('fail');
      }
    });
  }
});

router.post('/signup/nodemailer', (req, res) => {
  const usermail = req.body.email;
  const ranNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

  const sqlCheck = 'select * from user where email = ?';
  const sql = 'insert into signup_auth (token,useremail) values (?,?)';
  const mailoptions = {
    from: 'punco@naver.com',
    to: usermail,
    subject: '커뮤니티 인증번호입니다',
    text: `오른쪽 숫자를 입력해주세요 ${ranNum}`,
  };
  db.query(sqlCheck, [usermail], (err, result) => {
    if (result.length > 0) {
      res.send('fail');
    } else {
      Transport.sendMail(mailoptions, () => {
        Transport.close();
      });

      db.query(sql, [ranNum, usermail], () => {
        if (err) throw err;
        res.send('ok');
      });
    }
  });
});

router.post('/signup/check_auth', (req, res) => {
  const usertoken = req.body.check_token;
  const useremail = req.body.email;
  const sql = 'select * from signup_auth where token = ? and useremail = ?';
  const sqlSignupAuth = 'update signup_auth set signed = \'ok\' where id = ?';
  db.query(sql, [usertoken, useremail], (err, result) => {
    if (result.length > 0) {
      if (result[0].signed === 'ok') {
        res.send('emailerr');
      } else {
        db.query(sqlSignupAuth, [result[0].id], () => {
          res.send('success');
        });
      }
    } else {
      res.send('noauth');
    }
  });
});

// 회원가입

router.get('/withdrawal', (req, res) => {
  const sql = 'delete from user where id  = ?';
  const sqlDeleteReq = 'delete from req where user = ?  or user_like = ?';
  const sqlGetUseremail = 'select email from user where id = ?';
  const sqlDeleteSignup = 'delete from signup_auth where useremail = ?';
  db.query(sqlDeleteReq, [req.user, req.user], (err) => {
    if (err) throw err;
    db.query(sqlGetUseremail, [req.user], (errSqlGetUseremail, result) => {
      if (errSqlGetUseremail) throw errSqlGetUseremail;
      const { useremail } = result[0];
      db.query(sqlDeleteSignup, [useremail], (errSqlDelteSignup) => {
        if (errSqlDelteSignup) throw errSqlDelteSignup;
        db.query(sql, [req.user], (errSql) => {
          if (errSql) throw errSql;
          req.logout();
          req.user = null;
          res.send('logout');
        });
      });
    });
  });
});

router.get('/home', (req, res) => {
  let sex;
  const sqlGetsex = 'select sex from user where id = ?';
  const sql = 'select thumbnail,id,sex,nickname,age,height,intro from user where sex = ? limit ?,?';
  const limit = req.query.limit * 1;
  const page = (req.query.page - 1) * limit;
  if (req.user) {
    db.query(sqlGetsex, [req.user], (err, result) => {
      if (err) throw err;
      if (result[0].sex === 'man') {
        sex = 'woman';
      } else {
        sex = 'man';
      }
      db.query(sql, [sex, page, limit], (errSql, resultSql) => {
        if (errSql) throw errSql;
        res.send(resultSql);
      });
    });
  } else {
    res.send('noauth');
  }
});

router.get('/gettotalpage', (req, res) => {
  let sex;
  const sqlGetSex = 'select sex from user where id = ?';
  const sql = 'select * from user where sex = ?';
  if (req.user) {
    db.query(sqlGetSex, [req.user], (err, result) => {
      if (err) throw err;
      if (result[0].sex === 'man') {
        sex = 'woman';
      } else {
        sex = 'man';
      }
      db.query(sql, [sex], (errSql, resultSql) => {
        if (errSql) throw errSql;
        res.send(resultSql);
      });
    });
  }
});

router.post('/req', (req, res) => {
  const userLike = req.body.user_like;
  const sqlCheck = 'select * from req where user = ? and user_like = ?';
  const sql = 'insert into req (user,user_like) values (?,?)';
  const sqlCancel = 'delete from req where user = ? and user_like = ?';
  const sqlUpdate = 'update req set yes = \'yes\' where user = ? and user_like = ?';
  if (!req.user) {
    res.send('noauth');
  } else {
    db.query(sqlCheck, [req.user, userLike], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        db.query(sqlCancel, [req.user, userLike], (errSqlCancel) => {
          if (errSqlCancel) throw errSqlCancel;
          res.send('already');
        });
      } else {
        db.query(sqlCheck, [userLike, req.user], (errSqlCheck, resultSqlCheck) => {
          if (errSqlCheck) throw errSqlCheck;
          if (resultSqlCheck.length > 0) {
            db.query(sqlUpdate, [userLike, req.user], (errSqlUpdate) => {
              if (errSqlUpdate) throw errSqlUpdate;
              res.send('good');
            });
          } else {
            db.query(sql, [req.user, userLike], (errSql) => {
              if (errSql) throw errSql;
              res.send('ok');
            });
          }
        });
      }
    });
  }
});

// 홈

router.post('/kakao', (req, res) => {
  const { id } = req.body;
  const sql = 'select kakao from user where id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result[0].kakao);
  });
});

router.get('/listyes', (req, res) => {
  let someone;
  const sql = 'select user,user_like from req where (user_like = ? or user = ?) and yes = \'yes\'';
  let where = '';
  db.query(sql, [req.user, req.user], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      if (result[0].user === req.user) {
        someone = result[0].user_like;
      } else {
        someone = result[0].user;
      }
      where += someone;
      for (let i = 1; i < result.length; i++) {
        if (result[i].user === req.user) {
          someone = result[i].user_like;
        } else {
          someone = result[i].user;
        }
        where += ` or id = ${someone}`;
      }
      const sqlFromWhere = `select id,sex,nickname,age,height,intro from user where id = ${where}`;
      db.query(sqlFromWhere, (errSqlFromWhere, resultSqlFromWhere) => {
        if (errSqlFromWhere) throw errSqlFromWhere;
        res.send(resultSqlFromWhere);
      });
    } else {
      res.send('none');
    }
  });
});

router.get('/listilike', (req, res) => {
  let where = '';
  const sqlMe = 'select user_like from req where user = ? and yes = \'no\'';
  db.query(sqlMe, [req.user], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      where += result[0].user_like;
      for (let i = 1; i < result.length; i++) {
        where += ` or id = ${result[i].user_like}`;
      }
      const sql = `select id,sex,nickname,age,height,intro from user where id = ${where}`;
      db.query(sql, (errSql, resultSql) => {
        if (errSql) throw errSql;
        res.send(resultSql);
      });
    } else {
      res.send('none');
    }
  });
});

router.get('/listsomeonelike', (req, res) => {
  const sqlMe = 'select user from req where user_like = ? and yes = \'no\'';
  let where = '';
  if (req.user) {
    db.query(sqlMe, [req.user], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        where += result[0].user;
        for (let i = 1; i < result.length; i++) {
          where += ` or id = ${result[i].user}`;
        }
        const sql = `select id,sex,nickname,age,height,intro from user where id = ${where}`;
        db.query(sql, (errSql, resultSql) => {
          if (errSql) throw errSql;
          res.send(resultSql);
        });
      } else {
        res.send('none');
      }
    });
  } else {
    res.send('noauth');
  }
});

router.post('/res', (req, res) => {
  const someoneId = req.body.user_someone;
  const sqlCheck = 'select * from req where user = ? and user_like = ?';
  const sqlCancel = 'delete from req where user = ? and user_like = ?';
  const sql = 'update req set yes = \'yes\' where user = ? and user_like = ?';

  if (!req.user) {
    res.send('noauth');
  } else {
    db.query(sqlCheck, [someoneId, req.user], (err, result) => {
      if (err) throw err;
      if (result[0].yes === 'yes') {
        db.query(sqlCancel, [someoneId, req.user], (errSqlCancel) => {
          if (errSqlCancel) throw errSqlCancel;
          res.send('cancel');
        });
      } else {
        db.query(sql, [someoneId, req.user], (errSql) => {
          if (errSql) throw errSql;
          res.send('ok');
        });
      }
    });
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({ user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  req.user = null;
  res.send('logout');
});

// 로그인 & 로그아웃

router.get('/auth', (req, res) => {
  if (req.user) {
    const sql = 'select nickname,sex,id from user where id  = ?';
    db.query(sql, [req.user], (err, result) => {
      if (err) throw err;
      res.send(result[0]);
    });
  } else {
    res.send('noauth');
  }
});

// 자격조회

module.exports = router;
