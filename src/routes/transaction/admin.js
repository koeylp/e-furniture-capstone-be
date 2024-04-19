const express = require("express");
const router = express.Router();
const TransactionController = require("../../controllers/transactionController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(512));

// router.post(
//   "/",
//   hasPermission(global.PermissionConstants.ADMIN_POST),
//   asyncHandler(TransactionController.createTransaction)
// );
router.get(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(TransactionController.getTransactions)
);
router.get(
  "/detail/:transaction_id",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(TransactionController.findTransactionByID)
);

module.exports = router;
