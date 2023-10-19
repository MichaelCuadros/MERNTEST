const express = require("express");
const router = express.Router();
const questionController = require("../controller/question");
const auth = require("../middlewares/auth");

// Definir rutas
router.post("/register", auth.auth, questionController.register);
router.get("/questions/module", auth.auth, questionController.getQuestionsByModule);
router.get("/questions/free-module/:idModule", questionController.getFreeModuleQuestions);
router.post("/questions/purchase", auth.auth, questionController.getQuestionsByPurchase);

// Exportar router
module.exports = router;