const config = require("../config/auth.config");
const db = require("../models");
const Project = db.project;
const Task = db.task;

const { dateHelper, mailerHelper } = require("../helpers");

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
        
        pr.user = req.userId;
            pr.save((err, pr) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            } 
            res.send({ message: "Success!",
                       projectId: pr._id  });
    
        });
    });
  };


exports.delete = (req, res) => {
    Project.findById(req.params.projectid, (err, project) => {
        if (err) {
            res.status(500).send({ message : err});
        }
        project.tasks.forEach(taskid => {
            Task.findByIdAndDelete(taskid, (err) => {
                if (err) {
                    res.status(500).send({ message : err});
                }
            });
        });
    });

    Project.findByIdAndDelete(req.params.projectid, (err, project) =>{
        if (err) {
            res.status(500).send({ message : err});
        }
        res.send({message: "Project with id: " + project._id + " deleted! "});
    });
}


exports.update = (req, res) => {

    Project.findById(req.params.projectid, (err, project) => {
        if (err) {
            res.status(500).send({ message : err});
        }
        if (req.body.name) project.name = req.body.name;
        if (req.body.description) project.description = req.body.description;
        if (req.body.finishing_date) project.finishing_date = dateHelper.parseDate(req.body.finishing_date);
        

        project.save((err, pr) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
        
        
            res.send({ message: "Project with id: " + pr._id + " was updated successfully!" });
        
            
          });
    });

    
   
  };


  exports.finish = (req, res) => {
    Project.findById(req.params.projectid,(err, project) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        project.state = "Finalizado";
        project.save((err) => {
            if (err){
                res.status(500).send({message : err});
            }
            mailerHelper.sendFinishedProjectMail(project)
            res.send({message: "Project with id : " + project._id + " finished!"});
        })
    });

  }

 
  