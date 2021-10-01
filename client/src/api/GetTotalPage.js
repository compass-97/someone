import axios from 'axios';

const GetTotalPage = (limit) => axios({
  method: 'get',
  url: `${process.env.REACT_APP_SERVER_HOST}/gettotalpage`,
  withCredentials: true,
}).then((res) => Math.ceil(res.data.length / limit));

export default GetTotalPage;
