const express = require("express");
const router = express.Router();
const {
  newOrder,
  getAdminOrders,
  getSingleOrder,
  proccessOrder,
  getMyOrders,
  getVendorOrders,
  confirmVendorOrder,
  updateDeliveryStatus,
} = require("../controller/order");

const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post("/create", authenticateUser, newOrder);

router.put(
  "/update/:_id",
  authenticateUser,
  authorizeRoles("admin"),
  proccessOrder
);

router.get("/:_id", authenticateUser, getSingleOrder);
router.get("/my", authenticateUser, getMyOrders);
router.get("/admin", authenticateUser, authorizeRoles("admin"), getAdminOrders);

// Vendor routes
router.get(
  "/vendor",
  authenticateUser,
  authorizeRoles("vendor"),
  getVendorOrders
);
router.put(
  "/vendor/:id/confirm",
  authenticateUser,
  authorizeRoles("vendor"),
  confirmVendorOrder
);
router.put(
  "/vendor/:id/delivery",
  authenticateUser,
  authorizeRoles("vendor"),
  updateDeliveryStatus
);

module.exports = router;
