const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts.controllers");
const users = require("../controllers/users.controllers");
const middleware = require("../middlewares/secure.middleware");
const userController = require("../controllers/auth.controllers");

router.post("/api/posts", middleware.checkAuth, posts.create);
router.get("/api/posts", middleware.checkAuth, posts.list);
router.get("/api/posts/:id", middleware.checkAuth, posts.detail);
router.patch("/api/posts/:id", middleware.checkAuth, posts.update);
router.delete("/api/posts/:id", middleware.checkAuth, posts.delete);

router.post("/api/users", users.create);
router.get("/api/users", users.list);
router.get("/api/users/:id", users.detail);
router.patch("/api/users/:id", users.update);
router.delete("/api/users/:id", users.delete);

router.post("/api/login", users.login);

router.post("/api/users/create", userController.create);
router.get(
  "/api/users/confirm/:token",
  middleware.checkAuth,
  userController.confirm
);
router.post("/api/users/login", userController.login);

module.exports = router;
