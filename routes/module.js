const express=require("express");
const router=express.Router();
const moduleController=require("../controller/module");
const auth=require("../middlewares/auth");


//definir rutas
router.post("/register",auth.auth,moduleController.register);
router.get("/listall",auth.auth,moduleController.module_list);
router.get("/listallbycourse/:code", moduleController.module_list_by_course);


//exportar router
module.exports=router;