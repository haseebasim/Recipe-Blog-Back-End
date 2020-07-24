const express = require("express");
require("./db/mongoose");
const cors = require("cors");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comments");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
//routes
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);

app.listen(port, () => {
  console.log("HAHA working server! " + port);
});
