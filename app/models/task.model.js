const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    name: String,
    description: String,
    execution_date : Date,
    state: String,
    project: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project"
        }
      
  })
);

module.exports = Task;