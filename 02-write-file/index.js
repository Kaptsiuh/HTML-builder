const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const writeStream = fs.createWriteStream(path.join(__dirname, "text.txt"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Hello, write text, please!\n",
});

rl.prompt();

rl.on("line", (input) => {
  if (input.trim().toLowerCase() === "exit") {
    rl.emit("SIGINT");
  }
  writeStream.write(input);
  writeStream.write("\n");
});

rl.on("SIGINT", () => {
  rl.setPrompt("Good day. Be Happy");
  rl.prompt();
  process.exit(0);
});
