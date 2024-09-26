const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
var cors = require("cors");
const https = require("node:https");
const fs = require("node:fs");

const app = express();
app.use(express.json());

const certDir = `/home/ubuntu`;
const domain = `kianai158.shop`;
const options = {
  key: fs.readFileSync(`./${domain}/privkey.pem`),
  cert: fs.readFileSync(`./${domain}/fullchain.pem`),
};

const router = require("./app/routers");
const AppError = require("./app/ultils/appErrors");
const globalError = require("./app/controllers/erroeControllers");
var whitelist = [
  "http://localhost:3000",
  "https://kianai158.shop",
  "https://47.129.3.33",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/api/v1", router);
app.get("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server! `, 404));
});
app.use(globalError);

// var httpsServer = https.createServer(options, app);
// const serve = httpsServer.listen(4000, () => {
//   console.log(`http://localhost:${process.env.PORT}/api/v1`);
// });

// const { sequelize } = require("./app/model");

// sequelize.sync({ force: false });

/*

--------------------Ma hoa data ------------------------------

const key = new NodeRSA({ b: 512 });
const data4 = key.exportKey("pkcs8-public-pem");
const data5 = key.exportKey("pkcs1-pem");

fs.writeFile("temp4.txt", data4, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});

fs.writeFile("temp5.txt", data5, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});

fs.readFile("temp5.txt", "utf-8", (err, data2) => {
  const key1 = new NodeRSA();
  key1.importKey(data2, "pkcs1-pem");
  fs.readFile("saa.txt", "utf-8", (err, data1) => {
    const decryptedString = key1.decrypt(data1, "utf8");
    console.log("\nDECRYPTED string: ");
    console.log(decryptedString);
  });
});
*/

const serve = app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/api/v1`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  serve.close(() => {
    process.exit(1);
  });
});
