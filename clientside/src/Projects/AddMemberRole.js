import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SearchBar from "../Componentss/SearchBar";
const AddMemberRole = ({ show, handleClose, handleSave }) => {
  const [projectRole, setProjectRole] = useState();
  const [memberId, setMemberId] = useState();
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Member Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchBar
            placeholder="Search Employees"
            projectRole={projectRole}
            setProjectRole={setProjectRole}
            setMemberId={setMemberId}
            //   employees={employees}
            //   setEmployees={setEmployees}
            //   addEmployeeToMeeting={addEmployeeToMeeting}
            //   myId={userId}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave(projectRole, memberId)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddMemberRole;
