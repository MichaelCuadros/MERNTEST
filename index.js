const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const User = require("./Model/user");
const axios = require('axios');

console.log("Bienvenido");

connection();

const app = express();
const puerto = 3900;

const corsOptions = {
  origin: ["https://www.aprobandosinestudiar.com","https://aprobandosinestudiar.com",],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config rutas
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);
const courseRoutes = require("./routes/course");
app.use("/api/course", courseRoutes);
const moduleRoutes = require("./routes/module");
app.use("/api/module", moduleRoutes);
const questionRouter = require("./routes/question");
app.use("/api/question", questionRouter);
const commentRouter = require("./routes/comment");
app.use("/api/comment", commentRouter);

//cron.schedule("0 0 * * *", async () => {
  // Se ejecuta todos los días a las 12:00 AM
  //const sevenDaysAgo = new Date();
//  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Resta 7 días a la fecha actual

  //await User.updateMany(
    //{ create_at: { $lte: sevenDaysAgo }, isEnabled: true, rank: "user" },
    //{ isEnabled: false }
  //);
 // console.log("Usuarios deshabilitados");
//});

cron.schedule("*/2 * * * *", async () => {
  try {
      await axios.get('https://aprobandosinestudiar.com/checking');
      console.log("Ping exitoso (CRON)");
  } catch (error) {
      console.error("Error al hacer ping:", error);
  }
});



app.listen(puerto, () => {
  console.log("servidor de node corriendo en el puerto", puerto);
});
