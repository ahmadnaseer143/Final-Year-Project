var mongoose = require("mongoose");

//Define a schema
var myVideoSchema = mongoose.Schema({
  roomUrl: {
    type: String,
  },
  hostedBy: {
    type: String,
  },
  title: {
    type: String,
  },
  agenda: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
});

module.exports = myVid = mongoose.model("myMeeting", myVideoSchema);
