
const { authJwt, verifyProject } = require("../middleware");
const controller = require("../controllers/project.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/project/create",
    [authJwt.verifyToken, authJwt.isOperator, verifyProject.newValidProject],
    controller.create
  );

  app.delete(
    "/api/project/delete/:projectid",
    [authJwt.verifyToken, authJwt.isOperator, verifyProject.checkProjectExisted],
    controller.delete
  )
  app.put(
    "/api/project/update/:projectid",
    [authJwt.verifyToken, authJwt.isOperator, verifyProject.newValidDates],
    controller.update
  )

  app.put(
    "/api/project/finish/:projectid",
    [authJwt.verifyToken, authJwt.isOperator, verifyProject.checkAllTaskFinished],
    controller.finish
  )
  
};