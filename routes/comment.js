const express=require("express");
const router=express.Router();
const commentController=require("../controller/comment");
const auth=require("../middlewares/auth");

//definir rutas
router.post("/register",auth.auth,commentController.registerComment);
router.get("/list/:idModule",auth.auth,commentController.list);

//exportar router
module.exports=router;