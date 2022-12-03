// Import packages
const express = require("express");
const axios = require("axios");
const home = require("./routes/home");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

// Middlewares
const app = express();
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/home", home);

//Uploading a file to imgix.
app.post("/uploadToImgix", upload.single("pic"), async (req, res) => {
  const file = req.file;
  console.log("/uploadToImgix in server.js");
  console.log(file);

  var config = {
    method: "post",
    url:
      `https://api.imgix.com/api/v1/sources/upload/62e31fcb03d7afea23063596/` +
      file.originalname,
    headers: {
      Authorization: "Bearer " + process.env.IMGIX_API,
      "Content-Type": file.mimetype,
      "Accept-Encoding": "application/json",
    },
    data: req.file.buffer,
  };

  let final = await axios(config)
    .then(function (response) {
      console.log("successful call from /uploadToImgix in server.js");
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });

  let trueFinal = {
    allData: final,
    theBufferReturned: req.file.buffer,
  };
  return res.status(200).send(trueFinal);
});

//Get sensitive data status:
app.get("/testimgix", async (req, res) => {
  console.log("ran /testimgix");
  var config = {
    method: "get",
    url: "https://api.imgix.com/api/v1/assets/62e31fcb03d7afea23063596/circuitttt.jpeg",
    headers: {
      Authorization: "Bearer " + process.env.IMGIX_API,
      "Content-Type": "image/jpeg",
      "Accept-Encoding": "application/json",
    },
  };

  let result = await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
  return res.status(200).send(result);
});

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));

//updated iwth this url
//https://backend-sensitive-images-hd1z5q6ax-jdawsonimgix.vercel.app/home
