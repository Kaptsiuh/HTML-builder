const fs = require("node:fs/promises");
const path = require("node:path");

(async () => {
  const entities = await fs.readdir(path.join(__dirname, "secret-folder"), {
    withFileTypes: true,
  });

  const files = entities.filter((e) => e.isFile());

  const info = await Promise.all(
    files.map(async (file) => {
      const { size } = await fs.stat(
        path.join(__dirname, "secret-folder", file.name)
      );
      const ext = path.extname(file.name).slice(1);
      const name = file.name.replace(`${path.extname(file.name)}`, "");
      const kb = (size / 1024).toFixed(3);
      return [name, ext, kb];
    })
  );

  info.forEach((size) => {
    console.log(`${size[0]} - ${size[1]} - ${size[2]}kb`);
  });
})();
