import express from 'express';
import { myDataBase } from '../db';
import cors from 'cors';
import AuthRouter from './router/auth';
import PostRouter from './router/post';
import CommentRouter from './router/comment'
export const tokenList = {};

myDataBase
  .initialize()
  .then(() => {
    console.log('DataBase has been initialized!');
  })
  .catch((err) => {
    console.error('Error during DataBase initialization:', err);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000/',
    credentials: true
  }),
);

app.use('/auth', AuthRouter);
app.use('/posts', PostRouter);
app.use('/comments', CommentRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server started on port 3000');
});
