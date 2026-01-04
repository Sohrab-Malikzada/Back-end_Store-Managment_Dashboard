import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock
} from '../controllers/productsController.js';

const router = express.Router();

// CRUD
router.get('/', getAllProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Inventory Logic
router.patch('/:id/stock', adjustStock);

export default router;
