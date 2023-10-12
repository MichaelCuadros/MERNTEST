const express=require("express");
const router=express.Router();
const courseController=require("../controller/course");
const auth=require("../middlewares/auth");

//definir rutas
router.post("/register",auth.auth,courseController.register);
router.get("/listall",courseController.courses_list);


//exportar router
module.exports=router;