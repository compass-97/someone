import React, { useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';

const Pagenav = styled.div`
  text-align: center;
`;
const Pagebtn = styled.button`
  background: none;
  border: 1px solid gray;
  padding: 7px 10px;
  cursor: pointer;
  margin-right: 1px;
`;
const Pagebtnc = styled.button`
  background: #0080ff;
  color: #fff;
  border: 1px solid gray;
  padding: 7px 10px;
  cursor: pointer;
  margin-right: 1px;
`;

const Pagination = ({
  currentpage, totalpage, url, history,
}) => {
  const [cp, setCp] = useState(currentpage);

  const color = (idx) => {
    document.getElementById(cp).style.color = 'black';
    document.getElementById(cp).style.background = 'none';
    document.getElementById(idx).style.color = '#fff';
    document.getElementById(idx).style.background = '#0080ff';
    setCp(idx);
  };

  return (
    <Pagenav>
      <Pagebtn
        onClick={
          currentpage === 1
            ? null
            : () => {
              history.push(url + (currentpage - 1));
              color(currentpage - 1);
            }
        }
      >
        &lt;
      </Pagebtn>
      {[...Array(totalpage)].map((value, idx) => (idx + 1 === currentpage ? (
        <Pagebtnc
          id={idx + 1}
          onClick={() => {
            history.push(url + (idx + 1));
            color(idx + 1);
          }}
        >
          {idx + 1}
        </Pagebtnc>
      ) : (
        <Pagebtn
          id={idx + 1}
          onClick={() => {
            history.push(url + (idx + 1));
            color(idx + 1);
          }}
        >
          {idx + 1}
        </Pagebtn>
      )))}
      <Pagebtn
        onClick={
          currentpage === totalpage
            ? null
            : () => {
              history.push(url + (currentpage + 1));
              color(currentpage + 1);
            }
        }
      >
        &gt;
      </Pagebtn>
    </Pagenav>
  );
};

export default withRouter(Pagination);
