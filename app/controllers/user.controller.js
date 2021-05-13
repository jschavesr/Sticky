const config = require("../config/auth.config");
const db = require("../models");

const { mailerHelper } = require("../helpers");

const User = db.user;
const Role = db.role;

var bcrypt = require("bcryptjs");

exports.create = (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
        Role.find(
          {
             name: "operador"  
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            user.roles = roles.map(role => role._id);
            user.state = "Enabled";
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              
              mailerHelper.sendCreationUserMail(user.email, user.username, req.body.password);
              res.send({ message: "Operator was registered successfully!" });
            });
          }
        );
      
    });
  };



  exports.changePassword = (req, res) => {
   
    User.updateOne({_id: req.userId}, {password: bcrypt.hashSync(req.body.new_password, 8)}).exec((err, user) => {

        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(201).send({message: "Password changed succesfully"});
        return;
      });


   
  };


  exports.enableUser = (req, res) => {
    User.updateOne({_id: req.params.userid}, {state: "Enabled"}).exec((err, user) => {

        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(201).send({message: "Success"});
        return;
      });
  };
  
  exports.disableUser = (req, res) => {
   
    User.updateOne({_id: req.params.userid}, {state: "Disabled"}).exec((err, user) => {

        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(201).send({message: "Success"});
        return;
      });


   
  };
  


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  

  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.operatorBoard = (req, res) => {
    res.status(200).send("Operator Content.");
  };
  