
const { authJwt, verifyTask } = require("../middleware");
const controller = require("../controllers/task.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/task/create",
    [authJwt.verifyToken, authJwt.isOperator, verifyTask.newValidTask],
    controller.create
  );

  app.delete(
    "/api/task/delete/:taskid",
    [authJwt.verifyToken, authJwt.isOperator, verifyTask.checkTaskExisted],
    controller.delete
  );

  app.put(
    "/api/task/update/:taskid",
    [authJwt.verifyToken, authJwt.isOperator, verifyTask.checkTaskExisted, verifyTask.checkTaskUnfinished ,verifyTask.newValidDate],
    controller.update
  )
  

  app.post(
    "/api/task/finish/:taskid",
    [authJwt.verifyToken, authJwt.isOperator, verifyTask.checkTaskExisted, verifyTask.checkTaskUnfinished],
    controller.finish
  )
};