const db = require("../models");
const ROLES = db.ROLES;
const Project = db.project;
const Task = db.task;

const { dateHelper } = require("../helpers");

newValidProject = (req, res, next) => {


    if (!req.body.name) {    
        res.status(400).send({ message: "Failed! Name not given!" });
        return;
    }
    if (!req.body.description) {
        res.status(400).send({ message: "Failed! Description not given!" });
        return;
    }
    if (!req.body.starting_date) {
        res.status(400).send({ message: "Failed! starting_date not given!" });
        return;
    }
    if (!req.body.finishing_date) {
        res.status(400).send({ message: "Failed! finishing_date not given!" });
        return;
    }

    if (!dateHelper.checkFormat(req.body.starting_date) 
            || !dateHelper.checkFormat(req.body.finishing_date)) {
        res.status(400).send({ message: "Failed! Date should be valid in format yyyy-mm-dd!" });
        return;
    }


    
       
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let st_date = dateHelper.parseDate(req.body.starting_date);
    let fn_date = dateHelper.parseDate(req.body.finishing_date);


    if (st_date < today) {
        res.status(400).send({ message: "Failed! Invalid starting date, sould be today or later!" });
        return;
    }
    if (fn_date <= st_date) {
        res.status(400).send({ message: "Failed! Invalid finishing date, sould be after starting date!" });
        return;
    }
    next();
};


newValidDates = (req, res, next) => {

        Project.findById(req.params.projectid, (err, project) => {
            if (err) {
                res.status(500).send({ message : err});
            }
            
            // If finishing_date not given to update, current finishing date is used
            let new_fn_date = project.finishing_date;
            if (req.body.finishing_date) {
                if (!dateHelper.checkFormat(req.body.finishing_date)) {
                    res.status(400).send({ message: "Failed! Date should be valid in format yyyy-mm-dd!" });
                    return;
                }
                new_fn_date = dateHelper.parseDate(req.body.finishing_date);
            }

            if (new_fn_date <= project.starting_date) {
                res.status(400).send({ message: "Failed! Invalid: finishing date, sould be after starting date!" });
                return;
            }

            // If there is no task, any date after starting_date is valid
            if (project.tasks.length === 0) {
                next();
                return;
            }

            Task.find( {_id: { $in: project.tasks } },
                (err, tasks) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  let validDate = true;
                  for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].execution_date > new_fn_date) validDate = false;
                  }
                  if (validDate === false) {
                    res.status(400).send({ message: "Failed! Invalid: finishing date, sould be after every task date!" });
                    return;
                  }
                  next();
                }
              );
        });
  
      
   
};

checkAllTaskFinished = (req, res, next) => {

    Project.findById(req.params.projectid, (err, project) => {
        if (err) {
            res.status(500).send({ message : err});
        }
        
      
        // If there is no task, all task are technically finished
        if (project.tasks.length === 0) {
            next();
            return;
        }

        Task.find( {_id: { $in: project.tasks } },
            (err, tasks) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              let valid = true;
              for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].state === "En proceso") valid = false;
              }
              if (valid === false) {
                res.status(400).send({ message: "Failed! Not all tasks are finished!" });
                return;
              }
              next();
            }
          );
    });

  

};


checkProjectExisted = (req, res, next) => {

    Project.findById(req.params.projectid).exec((err, project) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!project) {
        res.status(400).send({ message: "Failed! Project is not in DB!" });
        return;
      }
      next();
  
    });
  };



const verifyProject = {
    newValidProject,
    newValidDates,
    checkAllTaskFinished,
    checkProjectExisted
};

module.exports = verifyProject;