const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "this is Api auth" });
});

module.exports = router;
