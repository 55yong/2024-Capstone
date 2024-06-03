// read-only
// const service = require("./payments.service.js");

import service from "./payments.service.js";

async function confirmPayment(req, res, next) {
  const confirmResponse = await service.confirmPayment(req.query);

  return res.json({ data: confirmResponse });
}

// module.exports = {
//   confirmPayment,
// };

export default { confirmPayment };
