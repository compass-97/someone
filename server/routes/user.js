const express = require('express');
const db = require('../db/meeting');
const upload = require('../api/s3');

const router = express();
const passport = require('../lib/passport')(router);

router.get('/auth/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (req.user === id) {
      res.send('auth');
    } else {
      res.send('noauth');
    }
  } catch (err) {
    console.log('user auth err');
  }
});

router.get('/userinfo/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const sql = 'select thumbnail,age,height,sex,nickname,intro from user where id = ?';
    db.query(sql, [id], (err, result) => {
      res.send(result);
    });
  } catch (err) {
    console.log('userinfo err');
  }
});

router.get('/plusinfo/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const sql = 'select id,img from plusimg where user_id = ?';
    db.query(sql, [id], (err, result) => {
      res.send(result);
    });
  } catch (err) {
    console.log('getplusimgErr');
  }
});

router.post('/edit/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    if (id === req.user) {
      const sql = 'update user set thumbnail = ?, intro = ?, nickname = ? where id = ?';
      const sqlPlus = 'insert into plusimg (user_id,img) values (?,?)';
      db.query(sql, [data.thumbnail, data.intro, data.nickname, id], () => {
        db.query(sqlPlus, [req.user, data.plusimg], () => {
          res.send('success');
        });
      });
    } else {
      res.send('noauth');
    }
  } catch (err) {
    console.log('useredit err');
  }
});

router.get('/deleteplusimg/:imgid/:id', (req, res) => {
  try {
    const imgId = Number(req.params.imgid);
    const id = Number(req.params.id);
    if (req.user === id) {
      const sql = 'delete from plusimg where id = ?';
      db.query(sql, [imgId], () => {
        res.send('success');
      });
    } else {
      console.log('noauthdeleteplusimg');
    }
  } catch (err) {
    console.log('deleteErr');
  }
});

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.send(req.file.location);
  } catch (err) {
    console.log('uploadErr');
  }
});

module.exports = router;
