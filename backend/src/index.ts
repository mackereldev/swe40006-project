import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app
    .use(cors())
    .use(express.json());

app.get("/", (_, res) => {
    res.json({ message: "Hello World!" });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
