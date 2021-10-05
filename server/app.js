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
  httpOnly: true,
  secure: true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  },
}));

app.use('/api', require('./routes/index'));

app.listen(PORT, () => {
  console.log(PORT, 'CONNECTED');
});
