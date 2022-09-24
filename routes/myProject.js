var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myProject = require("../model/myProject.model");
var Admin = require("../model/Admin.model");
const nodemailer = require("nodemailer");

// Get all Projects For Employee
router.get("/", (req, res, next) => {
  Admin.find({ employees: req.query.userId }, { username: 1 }, (err, rec) => {
    if (err) res.status(500).json(err);
    myProject
      .find({
        $or: [
          { projectAssignedBy: rec[0].username, projectAssignedTo: "" },
          { projectAssignedToId: req.query.userId },
        ],
      })
      .exec((error, records) => {
        if (error) throw error;
        res.status(200).json(records);
      });
  });
});

// Get all Projects under one organiziation
router.get("/organizationprojects", (req, res, next) => {
  // we need projectAssignedBy
  // console.log(req.query.name);
  myProject.find({ projectAssignedBy: req.query.name }, (err, rec) => {
    if (err) res.status(500).json(err);
    res.status(200).json(rec);
  });
});

// Get Completed Projects
router.get("/completed", (req, res, next) => {
  myProject
    .find({
      projectAssignedToId: req.query._id,
      projectFiles: {
        $elemMatch: {
          completionPercentage: "100",
          completed: "true",
        },
      },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

// Get Completed Projects Admin
router.get("/completedadmin", (req, res, next) => {
  myProject
    .find({
      projectAssignedBy: req.query.name,
      projectFiles: {
        $elemMatch: {
          completionPercentage: "100",
          completed: "true",
        },
      },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

// Get Incompleted Projects
router.get("/incompleted", (req, res, next) => {
  myProject
    .find({
      projectAssignedToId: req.query._id,
      $or: [
        { "projectFiles.completed": { $ne: true } },
        {
          projectFiles: {
            $elemMatch: {
              completionPercentage: "100",
              completed: "false",
            },
          },
        },
      ],
    })
    .exec((err, rec) => {
      if (err) res.status(500).json(err);
      // console.table(rec);
      res.status(200).json(rec);
    });
});

// Get Incompleted Projects Admin
router.get("/incompletedadmin", (req, res, next) => {
  myProject
    .find({
      projectAssignedBy: req.query.name,
      $or: [
        { "projectFiles.completed": { $ne: true } },
        {
          projectFiles: {
            $elemMatch: {
              completionPercentage: "100",
              completed: "false",
            },
          },
        },
      ],
    })
    .exec((err, rec) => {
      if (err) res.status(500).json(err);
      // console.table(rec);
      res.status(200).json(rec);
    });
});

// get not assigned projects
router.get("/notassigned", (req, res, next) => {
  Admin.find({ employees: req.query._id }, { username: 1 }, (err, rec) => {
    if (err) res.status(500).json(err);
    myProject
      .find({ projectAssignedBy: rec[0].username, projectAssignedTo: "" })
      .exec((error, records) => {
        if (error) throw error;
        res.status(200).json(records);
      });
  });
});

// get not assigned projects admin
router.get("/notassignedadmin", (req, res, next) => {
  myProject
    .find({ projectAssignedBy: req.query.name, projectAssignedTo: "" })
    .exec((error, records) => {
      if (error) throw error;
      res.status(200).json(records);
    });
});

// Get Specific Projects
router.get("/searchproject/:projectName", (req, res, next) => {
  // console.log(req.params.projectName);
  if (req.query._id) {
    myProject
      .find({
        projectAssignedToId: req.query._id,
        projectName: {
          $regex: req.params.projectName,
          $options: "i",
        },
      })
      .exec((error, records) => {
        if (error) throw error;
        res.json(records);
      });
  } else {
    myProject
      .find({
        projectAssignedBy: req.query.name,
        projectName: {
          $regex: req.params.projectName,
          $options: "i",
        },
      })
      .exec((error, records) => {
        if (error) throw error;
        res.json(records);
      });
  }
});

router.post("/addNewProject", async (req, res) => {
  const newProject = new myProject(req.body);
  //   console.log(newProject);
  //   console.log(req.body.hoursWorkedOn);
  try {
    const savedMessage = await newProject.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// search specific Project
router.get("/:userId", (req, res, next) => {
  // console.log(req.params.userId);
  myProject.findById(req.params.userId).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

router.post("/acceptvolunteerproject", (req, res) => {
  // console.log(req.body._id);
  // console.log(req.body.assignedTo);

  myProject
    .findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          projectAssignedTo: req.body.assignedTo,
          projectAssignedToId: req.body.assignedToId,
        },
      },
      { new: true }
    )
    .exec((error, records) => {
      if (error) res.status(500).send(error);
      res.status(200).json(records);
    });
});

router.post("/uploadmilestonefile", (req, res) => {
  // get project id
  // add project file in the giver project id
  // console.log(req.body.fileObj.completionPercentage);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $push: { projectFiles: req.body.fileObj } },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

router.post("/markprojectcompletion", (req, res) => {
  // console.log(req.body.completed);

  myProject.findOneAndUpdate(
    {
      _id: req.body.projectId,
      "projectFiles._id": req.body.projectFileId,
    },
    { $set: { "projectFiles.$.completed": req.body.completed } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

//Time worked on

router.post("/hoursWorked", (req, res, next) => {
  console.log("Time is: ", req.body.time);
  console.log("Breaks: ", req.body.breaks);
  console.log(req.body._id);

  // myProject.findOneAndUpdate(
  //   { _id: req.body._id },
  //   { $push: { hoursWorked: req.body.time, numOfBreaks: req.body.breaks } },

  //   (err, rec) => {
  //     if (err) res.status(500).json(err);
  //     res.status(200).json(rec);
  //   }
  // );
});

router.post("/sendemail", async (req, res) => {
  // console.log(req.body.receiverUsername);
  // we need the id of the receiver username
  // search in Admin
  const admin = await Admin.find({
    username: req.body.receiverUsername,
  }).exec();

  // console.log(admin[0].email);
  // now send email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: req.body.senderEmail, // sender address
    to: admin[0].email, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.description,
    attachments: [
      {
        filename: req.body.fileName,
        content: req.body.file,
        encoding: "base64",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json(error);
    } else {
      res.status(200).json(info);
    }
  });
});

module.exports = router;
