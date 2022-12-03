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
app.post("/imgixSensitiveData", async (req, res) => {
  console.log("Checking imgix status in /checkImgixSessionStatus");
  const nameOfImage = req.body.theValue;

  var config = {
    method: "get",
    url:
      `https://api.imgix.com/api/v1/assets/62e31fcb03d7afea23063596` +
      nameOfImage,
    headers: {
      Authorization: "Bearer " + process.env.IMGIX_API,
      "Content-Type": "application/json",
      "Accept-Encoding": "application/json",
    },
  };

  let result = await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.data.attributes.warning_adult));
      return response.data.data.attributes.warning_adult;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
  let number = result.toString();
  return res.status(200).send(number);
});

//Just to test if an imgix axios call will even work:
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
