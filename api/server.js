import app from "../src/app.js";
import dotenv from "dotenv";
dotenv.config();
const port = 4000;

app.listen(port, () => console.log(`Server listen on port: ${port}`));
