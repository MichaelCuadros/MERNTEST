const express=require("express");
const router=express.Router();
const mediaController=require("../controller/media");
const auth=require("../middlewares/auth");

//definir rutas
router.post("/register",auth.auth,mediaController.Register);


//exportar router
module.exports=router;