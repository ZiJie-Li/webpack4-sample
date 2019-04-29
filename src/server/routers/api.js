import express from 'express'
import fs from 'fs'
const router = express.Router()

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
}

/*router.get("/api", (req, res) => {
    let files = [];
    fs.readdirSync(apiPath).forEach(file => {
        if (!file.match(/\.(DS_Store)$/)) {
            files.push(file)
        }
    });

    res.status(200).json({ status: true, files: files })
});*/

/*router.get("/api/:imagename", (req, res) => {
  let imagename = encodeURIComponent(req.params.imagename);
  let imagepath = uploadPath + '/images/' + imagename;
  let image = fs.readFileSync(imagepath);
  let mime = fileType(image).mime;

  res.writeHead(200, { "Content-Type": mime });
  res.end(image, "binary");
});*/

router.get('/json', ({res}) => {
  res.status(200).json({ status: true })
});

export default router;