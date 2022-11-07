const fs = require("node:fs/promises");
const path = require("node:path");

(async () => {
  await fs.rm(path.join(__dirname, "files-copy"), {
    recursive: true,
    force: true,
  });

  await fs.mkdir(path.join(__dirname, "files-copy"), (err) => {
    if (err) throw err;
  });

  console.log("create 'files-copy'");

  const files = await fs.readdir(path.join(__dirname, "files"));
  files.forEach(async (e) => {
    await fs.copyFile(
      path.join(__dirname, "files", e),
      path.join(__dirname, "files-copy", e)
    );
  });
})();
