const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const bcrypt = require("bcryptjs")
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    User.findById(decoded.id).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        res.status(401).send({ message: "Token invalid!" });
        return;
      }
      req.userId = decoded.id;
      next();
    });
    

  });
};



verifyPass = (req, res, next) => {
    let pass = req.body.current_password 
    User.findById(req.userId).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        var passwordIsValid = bcrypt.compareSync(
            pass,
            user.password
        );
        
        if (!passwordIsValid) {
            return res.status(401).send({message: "Password invalid"})
        }

        next();
    });
  };


isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    console.log(user);
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isOperator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "operador") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Operator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  verifyPass,
  isAdmin,
  isOperator
};
module.exports = authJwt;