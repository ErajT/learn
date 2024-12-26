import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Cookies from "js-cookie"; // Import js-cookie
import axios from "axios"; // Import axios for API calls
import {Button } from "@mui/material";

const Container = styled.div`
  padding: 0 40px; 
  margin: 0 auto;
`;

const UserInfoBox = styled.div`
  background: url('/back.png') no-repeat center center;
  background-size: cover;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 50px auto;
  display: flex;
  align-items: center;
  gap: 40px;
  height: 250px;

  @media (max-width: 768px) {
    background: url('/back1.png') no-repeat center center; /* Use smaller image */
    background-size: cover;
    gap: 20px; /* Reduce gap for small screens */
    height: auto; /* Allow dynamic height */
    flex-direction: column; /* Stack content vertically */
    padding: 1px;
    margin: 10px 20px 10px 10px; /* Reduced margin for small screens */
    width:auto;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  color: #fff;
  padding: 20px;

  h2 {
    margin: 10px;
    font-size: 2rem;
    font-weight: bold;
  }
  p {
    margin: 10px;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1rem; /* Adjusted font size for small screens */
      // padding:10px;
    }
    p {
      font-size: 1rem;
      // padding:10px; /* Adjusted font size for small screens */
    }
  }
`;


const MaterialBoxesContainer = styled.div`
  margin-top: 80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* Two columns for medium screens */
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column for small screens */
    margin-top: 40px; /* Reduce top margin for small screens */
  }
`;

const MaterialList = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  p {
    font-size: 0.9rem;
    color: #777;
  }

  @media (max-width: 768px) {
    padding: 15px; /* Adjust padding for small screens */
    h3 {
      font-size: 1rem; /* Adjust font size for small screens */
    }
    p {
      font-size: 0.8rem; /* Adjust font size for small screens */
    }
  }
`;

const HomePage = () => {
  const [traineeDetails, setTraineeDetails] = useState({
    name: "",
    trainingName: "",
    companyName: "",
  });
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Fetch trainee details from the cookie
    const traineeDetailsCookie = Cookies.get("traineeDetails");
    console.log(traineeDetailsCookie);
    if (traineeDetailsCookie) {
      const parsedDetails = JSON.parse(traineeDetailsCookie);
      setTraineeDetails({
        name: parsedDetails.Name || "",
        trainingName: parsedDetails.TrainingName || "",
        companyName: parsedDetails.CompanyName || "",
      });
    }
    const trainingID = JSON.parse(traineeDetailsCookie).TrainingID; // Assuming trainingID is stored in cookies
    console.log(trainingID)
    if (trainingID) {

      axios.get(`http://localhost:2000/admin/getMaterial/${trainingID}`)
        .then(response => {
          if (response.data.status === "success") {
            setMaterials(response.data.materials);
          }
        })
        .catch(error => {
          console.error("Error fetching materials:", error);
        });
    }
  }, []);

  const handleViewFile = (base64File) => {
    const byteCharacters = atob(base64File); // decode base64
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' }); // Assuming the file is a PDF
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, '_blank');
  };

  return (
    <Container>
      <UserInfoBox>
        <UserInfo>
          <p>
            <label>Name:</label> {traineeDetails.name}
          </p>
          <p>
            <label>Training Name:</label> {traineeDetails.trainingName}
          </p>
          <p>
            <label>Company Name:</label> {traineeDetails.companyName}
          </p>
        </UserInfo>
      </UserInfoBox>
      <MaterialBoxesContainer>
      <MaterialList>
        <h3>Materials</h3>
        {materials.length > 0 ? (
          materials.map((material, index) => (
            <div key={index} className="material-item">
              <h4>{material.Title}</h4>
              <p>{material.Description}</p>
              <Button onClick={() => handleViewFile(material.File)} >
                View {material.Title}
              </Button>
            </div>
          ))
        ) : (
          <p>No materials available for this training.</p>
        )}
      </MaterialList>
      </MaterialBoxesContainer>
    </Container>
  );
};

export default HomePage;