const express=require("express");
const router=express.Router();
const questionController=require("../controller/question");
const auth=require("../middlewares/auth");


//definir rutas
router.get("/register",auth.auth,questionController.register);
router.get("/listall",auth.auth,questionController.question_list_by_module_codeCourse);
router.get("/listbymodule/:idModule",auth.auth,questionController.question_list_by_module);
router.get("/listbymodule_free/:idModule",questionController.question_free_list_by_module);
router.post("/list",auth.auth,questionController.list_questions_by_compra);
//exportar router
module.exports=router;