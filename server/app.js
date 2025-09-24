import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("WORKING SPLITLY");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
