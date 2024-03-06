const express = require("express");
const router = express.Router();
const BankInforController = require("../../controllers/bankInforController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(0));

router.post(
  "/",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(BankInforController.createBankInfor)
);
router.get(
  "/byAccount",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(BankInforController.findBankInforByAccount)
);
router.get(
  "/:bankInfor_id",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(BankInforController.findBankInforById)
);
router.put(
  "/",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(BankInforController.setDefault)
);
router.put(
  "/:bankInfor_id",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(BankInforController.updateBankInfor)
);
router.delete(
  "/",
  hasPermission(global.PermissionConstants.USER_DELETE),
  asyncHandler(BankInforController.deleteBankInfor)
);
router.delete(
  "/clear",
  hasPermission(global.PermissionConstants.USER_DELETE),
  asyncHandler(BankInforController.deleteAllBankInfor)
);

module.exports = router;
