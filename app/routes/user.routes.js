
const { authJwt, verifyUser } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.post(
    "/api/user/create",
    [authJwt.verifyToken, authJwt.isAdmin, verifyUser.checkDuplicateUsernameOrEmail],
    controller.create
  );

  app.put(
    "/api/user/changepass",
    [authJwt.verifyToken, authJwt.verifyPass],
    controller.changePassword
  );


  app.put(
    "/api/user/enable/:userid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.enableUser
  );
  app.put(
    "/api/user/disable/:userid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.disableUser
  );


/*
  app.post(
    "/api/user/enable",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );

  app.post(
    "/api/user/disable",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
*/
};