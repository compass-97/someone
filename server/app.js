const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(helmet.contentSecurityPolicy());

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: 'sessionid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  proxy: process.env.SESSION_PROXY,
  cookie: {
    httpOnly: true,
    secure: process.env.SESSION_SECURE,
  },
}));

app.use('/api', require('./routes/index'));
app.use('/user', require('./routes/user'));

app.listen(PORT, () => {
  console.log(PORT, 'CONNECTED');
});
