const express = require("express");
const router = express.Router();
const storeMethods = require("../Controllers/StoreOwner/store.controller");
const {
  storeValidationRules,
  validateStore,
} = require("../middlewares/storeMiddleware");
const {
  ownerValidationRules,
  validateOwner,
} = require("../middlewares/ownerMiddleware");
const ownerMethods = require("../Controllers/StoreOwner/owner.controller");
const {
  productValidationRules,
  validateProduct,
} = require("../middlewares/productMiddleware");
router.post(
  "/add-store",
  storeValidationRules,
  validateStore,
  storeMethods.createStore
);
router.post(
  "/owner-details",
  ownerValidationRules,
  validateOwner,
  ownerMethods.createOwner
);
router.post(
  "/add-product",
  productValidationRules,
  validateProduct,
  ownerMethods.addProduct
);
router.get("/owner-monthly-stats/:email", ownerMethods.getownerMonthlyStats);
router.get("/get-owner-orders/:email", ownerMethods.viewOrders);
router.get("/update-order/:orderID/:newStatus", ownerMethods.updateOrderStatus);
router.get("/products/:storeId", storeMethods.getProducts);
router.get("/get-all-stores/:email", ownerMethods.getStoresByEmail);
router.get("/get-a-store/:storeID", storeMethods.getStoreById);
router.delete("/delete-product/:productId", storeMethods.deleteProduct);
router.post("/update-product/", storeMethods.updateProduct);
router.post("/update-product-status/", storeMethods.updateEnableDisableProduct);




module.exports = router;
