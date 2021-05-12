const db = require("../models");
const ROLES = db.ROLES;
const Project = db.project;

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
    console.log("Today : " + today);
    console.log("st : " + st_date);
    console.log("fn : " + fn_date);

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



const verifyProject = {
    newValidProject
};

module.exports = verifyProject;