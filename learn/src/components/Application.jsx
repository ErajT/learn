import React, { useState, useEffect } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f9f9f9;
  min-height: 100vh;
  padding: 20px;
  color: #333;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  margin: 20px 0;
  font-size: 2rem;
  color: #2b6777;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DaySelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 5px;
    margin-bottom: 15px;
  }
`;

const DayButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${({ active }) => (active ? "#2b6777" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#2b6777")};
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
`;

const ChecklistContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }
`;

const ChecklistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

const Label = styled.span`
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const CloseButton = styled.button`
  background: #2b6777;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 8px 15px;
  }
`;

const Application = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [currentDay, setCurrentDay] = useState("Saturday");
  const [tasks, setTasks] = useState({
    Saturday: [
      { text: "Applied", done: false, type: "checkbox" },
      { text: "Applied with an Example", done: false, type: "example" },
      { text: "Applied with a Photo", done: false, type: "photo" },
      { text: "Applied with a Reference", done: false, type: "reference" },
    ],
    Sunday: [
      { text: "Applied", done: false, type: "checkbox" },
      { text: "Applied with an Example", done: false, type: "example" },
      { text: "Applied with a Photo", done: false, type: "photo" },
      { text: "Applied with a Reference", done: false, type: "reference" },
    ],
    Monday: [
      { text: "Applied", done: false, type: "checkbox" },
      { text: "Applied with an Example", done: false, type: "example" },
      { text: "Applied with a Photo", done: false, type: "photo" },
      { text: "Applied with a Reference", done: false, type: "reference" },
    ],
    Tuesday: [
      { text: "Applied", done: false, type: "checkbox" },
      { text: "Applied with an Example", done: false, type: "example" },
      { text: "Applied with a Photo", done: false, type: "photo" },
      { text: "Applied with a Reference", done: false, type: "reference" },
    ],
    Wednesday: [
      { text: "Applied", done: false, type: "checkbox" },
      { text: "Applied with an Example", done: false, type: "example" },
      { text: "Applied with a Photo", done: false, type: "photo" },
      { text: "Applied with a Reference", done: false, type: "reference" },
    ],
    Thursday: [
      { text: "Applied", done: false, type: "checkbox" },
      { text: "Applied with an Example", done: false, type: "example" },
      { text: "Applied with a Photo", done: false, type: "photo" },
      { text: "Applied with a Reference", done: false, type: "reference" },
    ],
    Friday: [
      { text: "Applied", done: false, type: "checkbox" },
      { text: "Applied with an Example", done: false, type: "example" },
      { text: "Applied with a Photo", done: false, type: "photo" },
      { text: "Applied with a Reference", done: false, type: "reference" },
    ],
  });

  const [modalType, setModalType] = useState(null);
  const [modalTask, setModalTask] = useState(null);
  const [modalInput, setModalInput] = useState("");
  const [trainees, setTrainees] = useState([]);
  const [selectedReference, setSelectedReference] = useState("");
  const base = "http://localhost:2000"; // Add protocol
  const trainingId = 1; // Constant training ID

  useEffect(() => {
    // Fetch all trainees for the reference dropdown
    fetch(`${base}/leaderboard/getAllTraineesForTraining/${trainingId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data["data"]);
        setTrainees(data["data"]);
      })
      .catch((error) => console.error("Error fetching trainees:", error));
  }, []);

  const handleCheckboxChange = (taskIndex) => {
    setTasks((prev) => {
      const updatedTasks = prev[currentDay].map((task, index) =>
        index === taskIndex ? { ...task, done: !task.done } : task
      );

      if (taskIndex === 0) {
        // If the first option is selected (index 0), call the simpleResponse API
        handleSimpleResponse();
      } else if (taskIndex >= 1) {
        // Open modal for example, photo, or reference
        handleOpenModal(prev[currentDay][taskIndex]);
      }

      return {
        ...prev,
        [currentDay]: updatedTasks,
      };
    });
  };

  const handleOpenModal = (task) => {
    setModalType(task.type);
    setModalTask(task.text);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setModalTask(null);
    setModalInput("");
  };

  const handleInputSubmit = () => {
    const commonPayload = {
      TrainingID: trainingId,
      TraineeID: 1, // Default to 1 if no trainee is selected
    };
    console.log(trainees);
    console.log(modalInput);

    if (modalType === "example") {
      fetch(`${base}/leaderboard/example`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commonPayload, Example: modalInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Example submitted:", data);
          handleCloseModal();
        })
        .catch((error) => console.error("Error submitting example:", error));
    }

    if (modalType === "photo" && modalInput) {
      const formData = new FormData();
      formData.append("photo", modalInput);
      formData.append("TrainingID", commonPayload.TrainingID);
      formData.append("TraineeID", commonPayload.TraineeID);

      fetch(`${base}/leaderboard/photo`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Photo uploaded:", data);
          handleCloseModal();
        })
        .catch((error) => console.error("Error uploading photo:", error));
    }
    console.log(commonPayload.TraineeID);
    console.log(selectedReference);

    if (modalType === "reference") {
      fetch(`${base}/leaderboard/refer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...commonPayload,
          refer: selectedReference,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Trainee referred:", data);
          handleCloseModal();
        })
        .catch((error) => console.error("Error referring trainee:", error));
    }
  };

  const handleSimpleResponse = () => {
    const commonPayload = {
      TrainingID: trainingId,
      TraineeID: selectedReference || 1, // Default to 1 if no trainee is selected
    };

    fetch(`${base}/leaderboard/simpleResponse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commonPayload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Simple response submitted:", data);
      })
      .catch((error) => console.error("Error submitting simple response:", error));
  };

  const reorderDays = () => {
    const indexOfSaturday = days.indexOf("Saturday");
    return [...days.slice(indexOfSaturday), ...days.slice(0, indexOfSaturday)];
  };

  return (
    <AppContainer>
      <Title>Weekly Checklist</Title>
      <DaySelector>
        {reorderDays().map((day) => (
          <DayButton key={day} active={day === currentDay} onClick={() => setCurrentDay(day)}>
            <span className="day-name">{window.innerWidth <= 768 ? day.charAt(0) : day}</span>
          </DayButton>
        ))}
      </DaySelector>
      <ChecklistContainer>
        {tasks[currentDay].map((task, index) => (
          <ChecklistItem key={index}>
            <Label>
              <Checkbox
                type="checkbox"
                checked={task.done}
                onChange={() => handleCheckboxChange(index)}
              />
              {task.text}
            </Label>
          </ChecklistItem>
        ))}
      </ChecklistContainer>
      {modalType && (
        <ModalOverlay>
          <ModalContent>
            <h3>{modalTask}</h3>
            {modalType === "photo" ? (
              <input type="file" onChange={(e) => setModalInput(e.target.files[0])} />
            ) : modalType === "reference" ? (
              <select
                value={selectedReference}
                onChange={(e) => setSelectedReference(e.target.value)}
              >
                <option value="">Select a trainee</option>
                {trainees.map((trainee) => (
                  <option key={trainee.TraineeID} value={trainee.TraineeID}>
                    {trainee.Name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter your input"
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
              />
            )}
            <CloseButton onClick={handleInputSubmit}>Submit</CloseButton>
            <CloseButton onClick={handleCloseModal} style={{ marginLeft: "10px" }}>
              Cancel
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </AppContainer>
  );
};

export default Application;
