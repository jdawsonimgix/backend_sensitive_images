// Import packages
const express = require("express");
const axios = require("axios");
const home = require("./routes/home");
require("dotenv").config();

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/home", home);

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
