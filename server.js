import express, { json, urlencoded } from "express";
import cors from "cors";
import router from "./payments.router.js";
import gpio from "@iiot2k/gpio"

const RELAY_PIN = 4;
gpio.init_gpio(RELAY_PIN, gpio.GPIO_MODE_OUTPUT, 1);

const app = express();

async function setRelay(amount) {
  gpio.set_gpio(RELAY_PIN, 0);

  await new Promise(resolve => setTimeout(resolve, amount));
  gpio.set_gpio(RELAY_PIN, 1);
}

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use("/sandbox-dev/api/v1/payments", router);

app.post("/sandbox-dev/api/v1/payments/confirm", (req, res) => {
  const reqData = req.body;

  setRelay(reqData.amount);

  console.log(reqData);

  res.json({ data: reqData });
});

app.listen(5000, () => console.log("Server is Listening..."));

// 프로그램이 종료되기 전에 GPIO 리소스를 해제
process.on('SIGINT', function () {
  gpio.set_gpio(RELAY_PIN, 1);
  gpio.deinit_gpio(RELAY_PIN);
  console.log(" -> program stopped");
  process.exit();
});
