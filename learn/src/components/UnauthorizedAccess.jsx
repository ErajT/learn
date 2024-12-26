import React from 'react';
import styled from 'styled-components';
import accessError from "../assets/accessError.png"
import { NavLink } from 'react-router-dom';


const UnauthorizedAccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Message = styled.h1`
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
`;


const UnauthorizedAccess = () => {
  return (
    <UnauthorizedAccessWrapper>
      <Image src={accessError} alt="Unauthorized Access" style={{"height":"80%"}}/>
      <Message>You are not authorized to access this page</Message>
      <NavLink to={"/"} > <p style={{"color":"blue",fontWeight:"bold"}}>
      Login to access this page
        </p></NavLink>
    </UnauthorizedAccessWrapper>
  );
};

export default UnauthorizedAccess;
