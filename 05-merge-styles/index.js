const fs = require("node:fs");
const fsPromise = require("node:fs/promises");
const path = require("node:path");

(async () => {
  const entities = await fsPromise.readdir(path.join(__dirname, "styles"), {
    withFileTypes: true,
  });

  const files = entities.filter((e) => {
    if (path.extname(e.name) === ".css") {
      return e;
    }
  });

  const writeStream = fs.createWriteStream(
    path.join(__dirname, "project-dist", "bundle.css")
  );

  files.forEach((e) => {
    fs.createReadStream(
      path.join(path.join(__dirname, "styles"), e.name),
      "utf-8"
    ).pipe(writeStream);
  });
})();
