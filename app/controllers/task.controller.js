const config = require("../config/auth.config");
const db = require("../models");
const Task = db.task;
const Project = db.project;

var bcrypt = require("bcryptjs");
const { dateHelper } = require("../helpers");

exports.create = (req, res) => {

    const task = new Task({
      name: req.body.name,
      description: ( req.body.description ? req.body.description : ""), 
      execution_date: dateHelper.parseDate(req.body.execution_date),
      state: "En proceso",
      Project: req.body.project_id
    });

 

    task.save((err, task) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      Project.findById(req.body.project_id,
        (err, project) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          project.tasks.push(task._id);
          project.save(err => {
            if(err) {
                res.status(500).send({message:err});
            }
          });

          task.project = project._id;
          task.save((err, ts) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Success",
                      taskId: ts._id });
          });
        }
      );
  
  
      
    });
  };

  exports.delete = (req, res) => {
 
    Task.findById(req.params.taskid,(err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Project.findById(task.project, (err, project) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
        
            const index = project.tasks.indexOf(task._id);
            project.tasks.splice(index, 1);
            project.save(err => {
                if(err) {
                    res.status(500).send({message:err});
                }
            });
        });
    });

    Task.findByIdAndDelete(req.params.taskid, (err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({message:"successfyly removed task with id: " + task._id});
    })
  }



  exports.update = (req, res) => {
 
    Task.findById(req.params.taskid,(err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (req.body.name) {
            task.name = req.body.name;
        }
        if (req.body.description) {
            task.description = req.body.description;
        }
        if (req.body.execution_date){
            task.execution_date = dateHelper.parseDate(req.body.execution_date);
        }
        task.save(err => {
            if (err){
                res.status(500).send({message : err});
            }
            res.send({message: "Task with id : " + task._id + " updated!"});
        })
    });
  }

  exports.finish = (req, res) => {
    Task.findById(req.params.taskid,(err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        task.state = "Finalizado";
        task.save(err => {
            if (err){
                res.status(500).send({message : err});
            }
            res.send({message: "Task with id : " + task._id + " finished!"});
        })
    });

  }
  