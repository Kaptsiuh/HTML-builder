const fs = require("node:fs");
const fsPromise = require("node:fs/promises");
const path = require("node:path");

(async () => {
  // create project-folder
  await fsPromise.rm(path.join(__dirname, "project-dist"), {
    recursive: true,
    force: true,
  });

  await fsPromise.mkdir(path.join(__dirname, "project-dist"), (err) => {
    if (err) throw err;
  });

  // assembling styles
  const entities = await fsPromise.readdir(path.join(__dirname, "styles"), {
    withFileTypes: true,
  });

  const files = entities.filter((e) => {
    if (path.extname(e.name) === ".css") {
      return e;
    }
  });

  const writeStream = fs.createWriteStream(
    path.join(__dirname, "project-dist", "style.css")
  );

  files.forEach((e) => {
    fs.createReadStream(
      path.join(path.join(__dirname, "styles"), e.name),
      "utf-8"
    ).pipe(writeStream);
  });

  // copy assets
  const assets = await fsPromise.readdir(path.join(__dirname, "assets"), {
    withFileTypes: true,
  });

  let copyFolder = async (from, to) => {
    await fsPromise.mkdir(to);

    const assets = await fsPromise.readdir(from, {
      withFileTypes: true,
    });

    assets.forEach(async (e) => {
      if (e.isFile()) {
        await fsPromise.copyFile(
          path.join(from, e.name),
          path.join(to, e.name)
        );
      } else {
        copyFolder(path.join(from, e.name), path.join(to, e.name));
      }
    });
  };

  await copyFolder(
    path.join(__dirname, "assets"),
    path.join(__dirname, "project-dist", "assets")
  );

  // assembling html
  fs.createWriteStream(path.join(__dirname, "project-dist", "index.html"));

  const stream = fs.createReadStream(
    path.join(__dirname, "template.html"),
    "utf-8"
  );

  const searchFile = await fsPromise.readdir(
    path.join(__dirname, "components"),
    {
      withFileTypes: true,
    }
  );

  let data = "";
  stream.on("data", (chunk) => (data += chunk));
  stream.on("end", async () => {
    for await (const e of searchFile) {
      const nameSearchFile = e.name.replace(`${path.extname(e.name)}`, "");
      const component = await fsPromise.readFile(
        path.join(__dirname, "components", e.name)
      );
      data = data.replace(`{{${nameSearchFile}}}`, component.toString());
    }
    fs.createWriteStream(
      path.join(__dirname, "project-dist", "index.html")
    ).write(data);
  });
})();
