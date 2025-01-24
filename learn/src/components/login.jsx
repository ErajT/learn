import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios"; // Import axios
import Cookies from "js-cookie"; // Import js-cookie for managing cookies
import { backendUrl } from "./constants";
import { useNavigate } from "react-router-dom";

// Styled Components (same as before)
const MainContainer = styled.div`
  background: linear-gradient(to bottom, #e0f7f3, #f0f8f7);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
`;

const Logo = styled.img`
  position: absolute;
  top: 5px;
  left: 10px;
  width: 100px;
  height: auto;
`;

const Container = styled.div`
  background-color: #f0f8f7;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: absolute;
  top: 18%;
  left: 20%;
  overflow: hidden;
  width: 60vw;
  max-width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: row;

  @media (max-width: 1000px) {
    width: 90vw;
    left: 5%;
    right: 5%;
    flex-direction: column;  // Stack elements vertically on smaller screens
  }
`;

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;  // Added padding for inner spacing
  max-width: 550px;  // Limit the max width of the Sign In part
  margin-left: 15px; // Add left margin for spacing
  box-sizing: border-box; // Ensure padding doesn't exceed width

  @media (max-width: 1000px) {
    width: 100%;  // Take up full width when the right panel is hidden
    padding: 30px;
    left: 50%;
    transform: translateX(-50%); // Center the sign-in form on small screens
  }
`;

const Form = styled.form`
  background-color: #f0f8f7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  color: #2b6777;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 8px 0;
`;

const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #2b6777;
  background-color: #2b6777;
  color: #f0f8f7;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  
  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`;

const ForgotPasswordLink = styled.a`
  color: #2b6777;
  font-size: 14px;
  margin-top: 10px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  background-color: #2b6777;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const Overlay = styled.div`
  color: #ffffff;
  text-align: center;
`;

const OverlayPanel = styled.div`
  padding: 0;
  text-align: center;
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;

const Snackbar = styled.div`
  visibility: ${(props) => (props.open ? "visible" : "hidden")};
  min-width: 250px;
  margin-left: -125px;
  background-color: ${(props) =>
    props.severity === "success" ? "#2b6777" : "#f44336"};
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
`;

const Login = () => {
  // const backendUrl = "http://localhost:2000";  // Use this in API calls
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!isValidEmail(email)) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      // console.log(`${backendUrl}/users/login`);
      const response = await axios.post(`${backendUrl}/users/login`,
         {
        email: email,
        password: password,
      });
      const position = response.data.position;
      const token1 = response.data.token;
      // console.log(token1);
      Cookies.set("token", JSON.stringify(token1));
      

      // console.log(response);

      if (response.status === 200) {
        // setSnackbarMessage("Login successful!");
        // setSnackbarSeverity("success");
        // setSnackbarOpen(true);

        if(position == "trainee")
        {
          Cookies.set("position", JSON.stringify("trainee"));
          // console.log("trainee if is called");
        // Second API call to fetch trainee details
        // console.log(`${backendUrl}/leaderboard/getDetails/${email}`);
        const tok = Cookies.get("token");
        const token = JSON.parse(tok);
        // console.log(token);
        const traineeDetailsResponse = await axios.get(
          `${backendUrl}/leaderboard/getDetails/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (traineeDetailsResponse.status === 200) {
          // Store trainee details in a cookie
          // console.log(traineeDetailsResponse.data.data);
          Cookies.set("traineeDetails1", JSON.stringify(traineeDetailsResponse.data.data), {
            expires: 7, // Cookie will expire in 7 days
            secure: true, // Ensure secure cookie usage in HTTPS
          });
          // console.log(traineeDetailsResponse.data.data)

          setSnackbarMessage("Login successful!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        
        }
        else{
          throw new Error("Login not allowed.");
        }
        
        setTimeout(() => {
          navigate("/ParticipantHome");
      }, 1500);
      }
      else if(position == "admin")
      {
        Cookies.set("position", JSON.stringify("admin"));
        setSnackbarMessage("Login successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/admin"); // Redirect on success
        }, 1500);
      }
      } else {
        throw new Error("Login failed.");
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Login failed.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };


  return (
    <MainContainer>
      {/* <Logo src="/Logo15.png" alt="Logo" /> */}
      <Container>
        <SignInContainer>
          <Form onSubmit={handleLogin}>
            <Title>Sign In</Title>
            <InputContainer>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputContainer>
            <Button disabled={loading}>Sign In</Button>
            <ForgotPasswordLink onClick={() => navigate("/forgot")}>
              Forgot Password?
            </ForgotPasswordLink>
          </Form>
        </SignInContainer>
        <OverlayContainer>
          <Overlay>
            <OverlayPanel>
              <Title>Welcome Back!</Title>
              <Paragraph>
                To keep connected with us, please login with your personal info
              </Paragraph>
            </OverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>
      <Snackbar open={snackbarOpen} severity={snackbarSeverity}>
        {snackbarMessage}
      </Snackbar>
    </MainContainer>
  );
};

export default Login;
