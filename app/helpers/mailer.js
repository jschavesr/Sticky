const nodemailer = require("nodemailer");
const db = require("../models");
require('dotenv').config();
const User = db.user;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
  

sendCreationUserMail = ( email, username, pass) => {
  var mailOptions = {
    from: 'pruebaslabcode9867@gmail.com',
    to: email,
    subject: 'User created on Sticky',
    html: '<h2>Welcome to Sticky</h2><br>Your new "operador" user was created. Please change your password. <br><b>Username:</b> ' + username + "<br> <b>Pass:</b> " + pass
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

sendFinishedProjectMail = (project) => {





    User.find()
        .populate("roles", "-__v")
        .exec((err, users) => {
        
        if (err) {
            console.log(err);
            return;
        }
          
        let emails = []
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j<users[i].roles.length; j++){
                if(users[i].roles[j].name === "admin") {
                    emails.push(users[i].email);
                }
            }
        }

        var mailOptions = {
            from: 'pruebaslabcode9867@gmail.com',
            to: emails,
            subject: 'Project finished on Sticky',
            text: 'The project with id ' + project._id + " and name " + project.name + " was finished"
          };
          console.log(mailOptions);
      
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
          
    });

  
  }

const mailerHelper = {
    sendCreationUserMail,
    sendFinishedProjectMail

};

module.exports = mailerHelper;