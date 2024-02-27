const express = require("express");
const router = express.Router();
const DistrictController = require("../../controllers/districtController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(512));

router.post(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_POST),
  asyncHandler(DistrictController.createDistrict)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(DistrictController.getAllDistricts)
);
router.get(
  "/:district_id",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(DistrictController.findDistrictById)
);
router.put(
  "/:district_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(DistrictController.updateDistrict)
);
router.put(
  "/increase/:district_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(DistrictController.increaseDistrict)
);
router.put(
  "/decrease/:district_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(DistrictController.decreaseDistrict)
);

module.exports = router;
