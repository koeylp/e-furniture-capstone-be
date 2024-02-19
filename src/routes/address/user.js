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
  hasPermission("[102]"),
  asyncHandler(AddressController.createAddress)
);
router.get(
  "/",
  hasPermission("[101]"),
  asyncHandler(AddressController.getAddressByUser)
);
router.get(
  "/default/",
  hasPermission("[101]"),
  asyncHandler(AddressController.getAddressDefault)
);
router.put(
  "/default/:address_id",
  hasPermission("[103]"),
  asyncHandler(AddressController.setAddressDefault)
);
router.put(
  "/:address_id",
  hasPermission("[103]"),
  asyncHandler(AddressController.editAddress)
);
router.delete(
  "/all",
  hasPermission("[104]"),
  asyncHandler(AddressController.removeAllAccountAddress)
);
router.delete(
  "/:address_id",
  hasPermission("[104]"),
  asyncHandler(AddressController.removeAddress)
);

module.exports = router;
