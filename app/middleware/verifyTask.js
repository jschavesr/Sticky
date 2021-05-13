const db = require("../models");
const ROLES = db.ROLES;
const Project = db.project;
const Task = db.task;

const { dateHelper } = require("../helpers");

newValidTask = (req, res, next) => {
 
    if (!req.body.name) {    
        res.status(400).send({ message: "Failed! Name not given!" });
        return;
    }
    
    if (!req.body.execution_date) {
        res.status(400).send({ message: "Failed! starting_date not given!" });
        return;
    }
    if (!req.body.project_id) {
        res.status(400).send({ message: "Failed! project_id not given!" });
        return;
    }

    if (!dateHelper.checkFormat(req.body.execution_date) ) {
        res.status(400).send({ message: "Failed! Date should be valid in format yyyy-mm-dd!" });
        return;
    }


    Project.findById(req.body.project_id).exec((err, project) => {

        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!project) {
            res.status(400).send({ message: "Failed! project with id given does not exist!" });
            return;
        }
        let today = new Date();
        today.setHours(0,0,0,0);
        let ex_date = dateHelper.parseDate(req.body.execution_date);

        let st_date = project.starting_date;
        let fn_date = project.finishing_date;

        if (ex_date < st_date || ex_date > fn_date) {
            res.status(400).send({ message: "Failed! Invalid starting date, sould be between dates of the project!" });
            return;
        }
        next();
    });

    return;
   
};

newValidDate = (req, res, next) => {
    if (!req.body.execution_date){
        next();
        return;
    }
    Task.findById(req.params.taskid).exec((err, task) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        Project.findById(task.project, (err, project)=> {
            let new_date = dateHelper.parseDate(req.body.execution_date);
            if (new_date < project.starting_date || new_date > project.finishing_date) {
                res.status(400).send({ message: "Failed! New date should be between project date!" });
                return;
            } 
            next();
        });
    });
};

checkTaskUnfinished = (req, res, next) => {
    Task.findById(req.params.taskid).exec((err, task) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (task.state === "Finalizado") {
          res.status(400).send({ message: "Failed! Task is alrady finished" });
          return;
        }
        next();
    
      });
    };

checkOwnershipNewTask = (req, res, next) => {
    Project.findById(req.body.project_id, (err, project) => {
        if (err) {
            res.status(500).send({ message : err});
        }
        if (project.user == req.userId) {
          next();
          return;
        }
        res.status(400).send({ message: "Failed! Project is from different user" });
      });
}
checkOwnershipExistingTask = (req, res, next) => {
    Task.findById(req.params.taskid).exec((err, task) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        Project.findById(task.project, (err, project) => {
            if (err) {
                res.status(500).send({ message : err});
            }
            if (project.user == req.userId) {
              next();
              return;
            }
            res.status(400).send({ message: "Failed! Project is from different user" });
          });
      
    
      });
}

checkTaskExisted = (req, res, next) => {

    Task.findById(req.params.taskid).exec((err, task) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!task) {
        res.status(400).send({ message: "Failed! Task is not in DB!" });
        return;
      }
      next();
  
    });
  };


const verifyTask = {
    newValidTask,
    newValidDate,
    checkTaskExisted,
    checkTaskUnfinished,
    checkOwnershipExistingTask,
    checkOwnershipNewTask

};

module.exports = verifyTask;