import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import multer from "multer";
import log from "./logger"; //logger doesnt block I/O like console.log does
import connect from "./db/connect";
import deserializeUser from "./middleware/validation/deserializeUser";
import cors from "cors"
dotenv.config();

import Route from "./routes/routes";

const upload = multer({ dest: 'uploads/'});

const PORT = process.env.PORT as any;
const HOST = process.env.HOST as string;

const app = express();

app.use(deserializeUser);
 
//middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3021', 'http://localhost:3040' , 'http://120.0.0.1:3021', 'https://livekitchen.com', 'http://livekitchen.com'];
var corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}
// const options: cors.CorsOptions = {
//   origin: allowedOrigins
// };
app.use(cors(corsOptions));
// app.use(cors({
//   origin: '*'
// }));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", Route);
app.get("/", (req, res) => res.status(200).send("Welcome to Live kitchen!!!"));
app.get("*", (req, res) => res.status(404).send("Page not found"));

app.listen(PORT, HOST, () => {
  log.info(`Server listening at http://${HOST}:${PORT}/api/v1`);
  connect();
});
