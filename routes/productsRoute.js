import express from 'express';
import {
  getAllProducts,
  getInventoryValue,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  // bulkImportProducts, // CSV Bulk Import Handler

} from '../controllers/productsController.js';

const router = express.Router();

// CRUD
router.get('/', getAllProducts);
router.get('/inventory-value', getInventoryValue);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


// Inventory Logic
router.patch('/:id/stock', adjustStock);
// CSV Bulk Import
// router.post('/bulk', bulkImportProducts); // CSV Bulk Import Route
export default router;
