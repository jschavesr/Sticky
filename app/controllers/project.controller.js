const config = require("../config/auth.config");
const db = require("../models");
const Project = db.project;
const Role = db.role;
const { dateHelper } = require("../helpers");

var bcrypt = require("bcryptjs");

exports.create = (req, res) => {
    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      starting_date: dateHelper.parseDate(req.body.starting_date),
      finishing_date: dateHelper.parseDate(req.body.finishing_date),
      state: "En proceso",
    });

    project.save((err, pr) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
  
      res.send({ message: "Project with id: " + pr._id + " was registered successfully!" });
  
      
    });
  };



 
  