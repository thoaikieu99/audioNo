const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
var cors = require("cors");

const app = express();
app.use(express.json());
const router = require("./app/routers");
// const { sequelize } = require("./app/model");
// sequelize.sync({ force: true });
var whitelist = ["http://localhost:3000", "https://kianai99.shop/"];
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
