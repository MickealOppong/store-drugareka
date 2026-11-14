import fs from "node:fs";

const version =
    process.env.RAILWAY_GIT_COMMIT_SHA || "local";

fs.mkdirSync("public", { recursive: true });

fs.writeFileSync(
    "public/version.json",
    JSON.stringify({ version }, null, 2)
);

console.log("Build version:", version);