import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import {
  createInvoice,
  deleteInvoice,
  editInvoice,
  getAllInvoice,
  getASingleInvoice,
} from "../controllers/invoiceControllers.js";

const router = express.Router();

//create invoice
router
  .route("/invoice/create")
  .post(isAuthenticated, authorizeRoles("admin"), createInvoice);

router
  .route("/invoice/allinv")
  .get(isAuthenticated, authorizeRoles("admin"), getAllInvoice);

router
  .route("/invoice/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getASingleInvoice)
  .put(isAuthenticated, authorizeRoles("admin"), editInvoice)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteInvoice);

export default router;
