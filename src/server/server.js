"use strict";

const express = require("express");
const fs = require("fs");
const app = express();
const router = express.Router();

const port = process.env.PORT || 8080;
const publicPath = __dirname + '/public';
const apiPath = __dirname + '/api';

const render = (filename, params = {}) => {
  let baseParams = {
    baseUrl: `http://localhost:${port}`
  };
  const mergeParams = Object.assign(baseParams, params);

  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) return reject(err);
      for (var key in mergeParams) {
        data = data.replace("@{" + key + "}", params[key]);
      }
      resolve(data);
    });
  });
};

router.get("/api", (req, res) => {
    let files = [];
    fs.readdirSync(apiPath).forEach(file => {
        if (!file.match(/\.(DS_Store)$/)) {
            files.push(file)
        }
    });

    res.status(200).json({ status: true, files: files })
});

/*router.get("/api/:imagename", (req, res) => {
  let imagename = encodeURIComponent(req.params.imagename);
  let imagepath = uploadPath + '/images/' + imagename;
  let image = fs.readFileSync(imagepath);
  let mime = fileType(image).mime;

  res.writeHead(200, { "Content-Type": mime });
  res.end(image, "binary");
});*/

router.get("/", (req, res) => {
  render(publicPath + '/index.html')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

// app.use(express.static(publicPath));
app.use("/", router);

app.use(({err, res}) => {
  if (err.code == "ENOENT") {
    res.status(404).json({ message: "Page Not Found !" });
  } else {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port);
console.log(`App Runs on http://localhost:${port}`);
