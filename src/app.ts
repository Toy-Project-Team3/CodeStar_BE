import express from 'express';
import { myDataBase } from "../db"
import cors from 'cors'

export const tokenList ={}

myDataBase
    .initialize()
    .then(() => {
        console.log("DataBase has been initialized!")
    })
    .catch((err) => {
        console.error("Error during DataBase initialization:", err)
    })

const app = express();

app.use(express.json())
app.use(express.urlencoded())
app.use(cors({
  origin: true
}))

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
