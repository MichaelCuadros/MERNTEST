const express=require("express");
const router=express.Router();
const userController=require("../controller/user");
const auth=require("../middlewares/auth");

//definir rutas
router.post("/register",userController.register);
router.post("/login",userController.login);
router.post("/add_course_to_user",auth.auth,userController.add_course_to_user);
router.post("/add_module_to_user",auth.auth,userController.add_module_to_user);
router.get("/comando",auth.auth,userController.comando);
router.post("/add_compra",auth.auth,userController.add_compra);


//exportar router
module.exports=router;