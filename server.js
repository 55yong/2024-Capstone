import express, { json, urlencoded } from "express";
import cors from "cors";

import router from "./payments.router.js";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use("/sandbox-dev/api/v1/payments", router);

app.post("/sandbox-dev/api/v1/payments/confirm", (req, res) => {
  const reqData = req.body;

  console.log(reqData);
  console.log(reqData.amount);

  res.json({ data: reqData });
});

app.listen(5000, () => console.log("Server is Listening..."));
