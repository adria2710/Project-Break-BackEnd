const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Rutas API (JSON)
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Vistas públicas (HTML)
router.get("/catalog", productController.showCatalog);
router.get("/catalog/:id", productController.showProductDetail);

// Dashboard 
router.get("/dashboard", productController.showDashboard);
router.get("/dashboard/new", productController.showNewProductForm);
router.post("/dashboard", productController.createProductFromForm);
router.get("/dashboard/:id/edit", productController.showEditProductForm);
router.post("/dashboard/:id/edit", productController.updateProductFromForm);
router.post("/dashboard/:id/delete", productController.deleteProductFromForm);

module.exports = router;