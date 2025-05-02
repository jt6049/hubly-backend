const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');
const userRoutes=require("./Router/user")
const authRoutes=require("./Router/auth")
const complainerRoutes=require("./Router/complainer"); 
const messageRoutes=require("./Router/messages");  
const cors = require('cors');
dotenv.config();
const { default: mongoose } = require('mongoose');
const PORT =  process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extened: true }));
app.use(errorHandler);
app.use("/api/user",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/complainer",complainerRoutes)
app.use("/api/message",messageRoutes)

app.get('/',  async(req, res) => {
    try {
      res.send('Hello world');
    } catch (err) {
      next(err);
    }
  });

  app.listen(PORT,()=>{
    console.log(`Server is running on port${PORT}`)
    mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlPArser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      console.log(err);
    });
  })