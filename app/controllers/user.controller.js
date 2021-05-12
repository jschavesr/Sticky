const config = require("../config/auth.config");
const db = require("../models");
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
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
  
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
  


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  

  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.operatorBoard = (req, res) => {
    res.status(200).send("Operator Content.");
  };
  