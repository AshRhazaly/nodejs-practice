const http = require("http");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const getPosts = async () => {
  try {
    return await axios.get("https://jsonplaceholder.typicode.com/posts");
  } catch (err) {
    throw err;
  }
};

const displayPosts = async () => {
  try {
    const posts = await getPosts(); 
    console.log(posts);
  } catch (err) {
    throw err;
  }
};

displayPosts();

const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );

  let extName = path.extname(filePath);

  let contentType = "text/html";

  switch (extName) {
    case ".js":
      contentType = "text.js";
      break;
    case ".css":
      contentType = "text.css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // page not found
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (err, content) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content, "utf-8");
          }
        );
      } else {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`Server error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
