const fs = require("node:fs");
const path = require("node:path");

const stream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
let data = "";
stream.on("data", (chunk) => (data += chunk));
stream.on("data", () => console.log(data));
stream.on("error", (error) => console.log("Error", error.message));
