const express = require("express");
const router = express.Router();
const AddressController = require("../../controllers/addressController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(2));

router.post(
  "/",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(AddressController.createAddress)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(AddressController.getAddressByUser)
);
router.get(
  "/default/",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(AddressController.getAddressDefault)
);
router.put(
  "/default/:address_id",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(AddressController.setAddressDefault)
);
router.put(
  "/:address_id",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(AddressController.editAddress)
);
router.delete(
  "/all",
  hasPermission(global.PermissionConstants.USER_DELETE),
  asyncHandler(AddressController.removeAllAccountAddress)
);
router.delete(
  "/:address_id",
  hasPermission(global.PermissionConstants.USER_DELETE),
  asyncHandler(AddressController.removeAddress)
);

module.exports = router;
