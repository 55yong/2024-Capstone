import express, { json, urlencoded } from "express";
import cors from "cors";
import router from "./payments.router.js";
import gpio from "@iiot2k/gpio";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import session from "express-session";

const RELAY_PIN = 4;
gpio.init_gpio(RELAY_PIN, gpio.GPIO_MODE_OUTPUT, 1);
const TIME = 1800000;

const app = express();

const db = new sqlite3.Database("./instance/db.sqlite");

app.use(bodyParser.json());
app.use(
  session({
    secret: "lsh190824!",
    resave: false,
    saveUninitialized: true,
  })
);

function convertAmountToMilliseconds(amount) {
  // 500원당 1800000밀리초
  return (amount / 500) * TIME;
}

async function setRelay(amount) {
  gpio.set_gpio(RELAY_PIN, 0);

  const INACTIVE_TIME = convertAmountToMilliseconds(amount);

  await new Promise(resolve => setTimeout(resolve, INACTIVE_TIME));
  gpio.set_gpio(RELAY_PIN, 1);
  console.log(INACTIVE_TIME);
}

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use("/sandbox-dev/api/v1/payments", router);

app.post("/sandbox-dev/api/v1/payments/confirm", (req, res) => {
  const reqData = req.body;

  //setRelay(reqData.amount);

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
  const { username, password, nickname, phone, email } = req.body;

  if (!username || !password || !nickname || !phone || !email) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  // Adjusted INSERT statement to set mileage to 0 by default
  const stmt = db.prepare(
    `INSERT INTO users (username, password, nickname, phone, email, mileage) VALUES (?, ?, ?, ?, ?, 0)`
  );

  stmt.run([username, password, nickname, phone, email], function (err) {
    if (err) {
      return res.status(400).json({ message: "The user already exists." });
    }
    res.status(201).json({ message: "Registration successful." });
  });
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

// 회원 탈퇴
app.delete("/delete_account", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err || !user || user.password !== password) {
        return res
          .status(401)
          .json({ message: "사용자 이름 또는 비밀번호가 잘못되었습니다." });
      }

      try {
        await db.run("DELETE FROM users WHERE username = ?", [username]);
        return res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
      } catch (error) {
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }
    }
  );
});

// 사용자 정보 가져오기
app.get("/get_user_info", (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  // 사용자 정보 조회 쿼리
  const query = `
    SELECT username, nickname, phone, email, mileage
    FROM users
    WHERE id = ?
  `;

  db.get(query, [user_id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }

    if (!row) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 사용자 정보 반환
    return res.status(200).json({
      username: row.username,
      nickname: row.nickname,
      phone: row.phone,
      email: row.email,
      mileage: row.mileage,
    });
  });
});

// 프로필 업데이트
app.put("/update_profile", async (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  const { nickname, phone, email, currentPassword, newPassword } = req.body;

  if (!nickname || !phone || !email || !currentPassword) {
    return res.status(400).json({ message: "모든 필드를 작성해주세요." });
  }

  try {
    // 사용자 정보 조회
    const getUserQuery = `
      SELECT * FROM users
      WHERE id = ?
    `;
    db.get(getUserQuery, [user_id], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }

      if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }

      if (user.password !== currentPassword) {
        return res
          .status(401)
          .json({ message: "현재 비밀번호가 올바르지 않습니다." });
      }

      // 프로필 업데이트 쿼리
      const updateProfileQuery = `
        UPDATE users
        SET nickname = ?, phone = ?, email = ?, password = ?
        WHERE id = ?
      `;
      const newPasswordValue = newPassword ? newPassword : user.password;

      db.run(
        updateProfileQuery,
        [nickname, phone, email, newPasswordValue, user_id],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ message: "서버 오류가 발생했습니다." });
          }

          return res
            .status(200)
            .json({ message: "프로필 업데이트가 완료되었습니다." });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 마일리지 추가
app.put("/add_mileage", async (req, res) => {
  const { username, mileage } = req.body;

  console.log(
    `Received request to add mileage: username=${username}, mileage=${mileage}`
  );

  if (!username || mileage === undefined) {
    return res.status(400).json({ message: "잘못된 요청입니다." });
  }

  try {
    const user = await getUserByUsername(username); // 사용자 조회
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 마일리지 추가 쿼리
    const addMileageQuery = `
      UPDATE users
      SET mileage = mileage + ?
      WHERE username = ?
    `;

    await runQuery(addMileageQuery, [mileage, username]); // 마일리지 추가 쿼리 실행

    return res.status(200).json({ message: "마일리지가 적립되었습니다." });
  } catch (error) {
    console.error("마일리지 추가 중 에러 발생:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 사용자 조회 함수
async function getUserByUsername(username) {
  const getUserQuery = `
    SELECT * FROM users
    WHERE username = ?
  `;
  return new Promise((resolve, reject) => {
    db.get(getUserQuery, [username], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

// 쿼리 실행 함수
async function runQuery(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
app.listen(5000, () => console.log("Server is Listening..."));

// 프로그램이 종료되기 전에 GPIO 리소스를 해제
process.on("SIGINT", function () {
  gpio.set_gpio(RELAY_PIN, 1);
  gpio.deinit_gpio(RELAY_PIN);
  console.log(" -> program stopped");
  process.exit();
});