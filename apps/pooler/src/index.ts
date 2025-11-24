import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("pooler: alive — ts-node & nodemon working ✅");
});

app.listen(PORT, () => {
  console.log(`pooler listening on http://localhost:${PORT}`);
});
