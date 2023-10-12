const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts.controllers");
const users = require("../controllers/users.controllers");
const middleware = require("../middlewares/secure.middleware");

router.post("/api/posts", middleware.checkAuth, posts.create);
router.get("/api/posts", middleware.checkAuth, posts.list);
router.get("/api/posts/:id", middleware.checkAuth, posts.detail);
router.patch("/api/posts/:id", middleware.checkAuth, posts.update);
router.delete("/api/posts/:id", middleware.checkAuth, posts.delete);

router.post("/api/login", users.login);
router.post("/api/users", users.create);
router.get("/api/users", users.list);
router.get("/api/users/:id", users.detail);
router.patch("/api/users/:id", users.update);
router.delete("/api/users/:id", users.delete);
router.get("/api/users/confirm/:token", middleware.checkAuth, users.confirm);

module.exports = router;
