import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import ShareWork from "./ShareWork";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({
  project,
  setProjects,
  volunteer,
  handleVolunteerClick,
  role,
  userEmail,
  check,
  widthh,
}) => {
  var {
    projectName,
    projectAssignedBy,
    projectDescription,
    projectPriority,
    projectCost,
    projectAssignedTo,
    hoursWorked,
    dueDate,
    milestones,
    completed,
    helpingMaterial,
    fileName,
  } = project;

  const navigate = useNavigate();

  const [width, setWidth] = useState();

  const downloadPDF = (pdf) => {
    const linkSource = pdf;
    const downloadLink = document.createElement("a");
    if (!fileName) fileName = "vct_illustration.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  useEffect(() => {
    // find in project files whether completed=true
    // get all the project files objects that has completed=true
    // then compare which has most completion percentage
    // store that
    if (!widthh) {
      const completeTrue = project.projectFiles.filter(
        (pf) => pf.completed == true
      );
      const cp = completeTrue.map((ct) => ct.completionPercentage);
      const max = Math.max(...cp);
      if (Number.isFinite(max)) setWidth(`${max}%`);
      else setWidth("0");
    }
  }, [project]);

  return (
    <div className="project-column">
      {volunteer == false && (
        <Button
          variant="contained"
          color="secondary"
          style={{ float: "right", marginTop: "25px", marginRight: "50px" }}
          onClick={() => handleVolunteerClick(project)}
        >
          Volunteer
        </Button>
      )}
      <div
        className="featuredItem"
        onClick={() => {
          projectAssignedTo && setProjects(project, check, width);
        }}
      >
        <span className="featuredTitle">{projectName}</span>
        <div className="assigned-by">
          <span className="featuredSub">Assigned By: </span>
          <span className="featuredTitle">{projectAssignedBy}</span>
        </div>
        {projectAssignedTo && (
          <div className="assigned-to">
            <span className="featuredSub">Assigned To: </span>
            <span className="featuredTitle">{projectAssignedTo}</span>
          </div>
        )}
        <div className="project-description">
          <span className="featuredSub">Description: </span>
          <span>{projectDescription}</span>
        </div>
        <div className="project-description">
          <span className="featuredSub">Cost: </span>
          <span>${projectCost}</span>
        </div>
        <div className="project-description">
          <span className="featuredSub">Priority: </span>
          <span>{projectPriority}</span>
        </div>
        <div className="helping-material">
          <div
            className="menu"
            style={{
              backgroundImage: `url(/Images/pdf.png)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "100px",
              float: "right",
            }}
            onClick={() => downloadPDF(helpingMaterial)}
          ></div>
        </div>
        <div className="hours-worked">
          <span className="featuredSub">Hours Worked: </span>
          <span>{hoursWorked}</span>
        </div>
        <div className="due-date">
          <span className="featuredSub">Due Date: </span>
          {typeof dueDate == "string" ? (
            <span>{dueDate.slice(0, 10)}</span>
          ) : (
            <span>{dueDate.toString().slice(3, 15)}</span>
          )}
        </div>
        <div className="progress">
          <div
            className="progress-done"
            style={{ opacity: "1", width: widthh ? widthh : width }}
          >
            {widthh ? widthh : width}
          </div>
          {/* {completed == "Completed" ? (
            <div
              className="progress-done"
              style={{ opacity: "1", width: "100%" }}
            >
              100%
            </div>
          ) : (
            <div
              className="progress-done"
              style={{ opacity: "1", width: "30%" }}
            >
              30%
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
