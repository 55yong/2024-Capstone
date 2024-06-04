import express, { json, urlencoded } from "express";
import cors from "cors";
import router from "./payments.router.js";
import gpio from "@iiot2k/gpio"
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import session from "express-session";

const app = express();

const RELAY_PIN = 4;
gpio.init_gpio(RELAY_PIN, gpio.GPIO_MODE_OUTPUT, 1);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

const db = new sqlite3.Database("./instance/db.sqlite");

app.use(bodyParser.json());
app.use(
  session({
    secret: "lsh190824!",
    resave: false,
    saveUninitialized: true,
  })
);

async function setRelay(amount) {
  gpio.set_gpio(RELAY_PIN, 0);

  await new Promise(resolve => setTimeout(resolve, amount));
  gpio.set_gpio(RELAY_PIN, 1);
}

app.use("/sandbox-dev/api/v1/payments", router);

app.post("/sandbox-dev/api/v1/payments/confirm", (req, res) => {
  const reqData = req.body;

  setRelay(reqData.amount);

  console.log(reqData);

  res.json({ data: reqData });
});

// 테이블 생성
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          nickname TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          mileage INTEGER DEFAULT 0
      )`);
});

// 회원가입
app.post("/register", (req, res) => {
  const { username, password, nickname, phone, email, mileage = 0 } = req.body;

  if (!username || !password || !nickname || !phone || !email) {
    return res.status(400).json({ message: "모든 필드를 작성해주세요." });
  }

  const stmt = db.prepare(
    `INSERT INTO users (username, password, nickname, phone, email, mileage) VALUES (?, ?, ?, ?, ?, ?)`
  );
  stmt.run(
    [username, password, nickname, phone, email, mileage],
    function (err) {
      if (err) {
        return res.status(400).json({ message: "이미 존재하는 사용자입니다." });
      }
      res.status(201).json({ message: "회원가입이 완료되었습니다." });
    }
  );
  stmt.finalize();
});

// 로그인
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user || user.password !== password) {
      return res.status(401).json({ message: "로그인 정보가 잘못되었습니다." });
    }

    req.session.user_id = user.id;
    res.status(200).json({
      message: "로그인 성공!",
      nickname: user.nickname,
      mileage: user.mileage,
    });
  });
});

app.listen(5000, () => console.log("Server is Listening..."));

// 프로그램이 종료되기 전에 GPIO 리소스를 해제
process.on('SIGINT', function () {
  gpio.set_gpio(RELAY_PIN, 1);
  gpio.deinit_gpio(RELAY_PIN);
  console.log(" -> program stopped");
  process.exit();
});
