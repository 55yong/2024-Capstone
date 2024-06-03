// read-only

import { Router } from "express";
import controller from "./payments.controller.js";
const router = Router();

// const controller = require("./payments.controller.js");

router.route("/confirm").get(controller.confirmPayment);

// module.exports = router;

export default router;
