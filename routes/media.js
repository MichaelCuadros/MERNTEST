const express=require("express");
const router=express.Router();
const mediaController=require("../controller/media");
const auth=require("../middlewares/auth");

//definir rutas
router.post("/register",auth.auth,mediaController.Register);
router.get("/checkmedias/:module_id",mediaController.checkCourseHasMedias);
router.get("/get_medias/:module_id",mediaController.get_medias);

//exportar router
module.exports=router;