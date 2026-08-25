import * as sass from "sass";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });
const result = sass.compile("src/styles/main.scss", { style: "compressed" });
writeFileSync("dist/main.css", result.css);
console.log("✔ SCSS compiled successfully to dist/main.css");
