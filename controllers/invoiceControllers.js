import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Invoice } from "../models/invoiceModel.js";

//generate Invoice ID
const generateCustomInvoiceId = async () => {
  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });

  if (lastInvoice && lastInvoice.customInvoiceId) {
    const lastId = parseInt(lastInvoice.customInvoiceId.replace("MI", ""));
    const nextId = lastId + 1;
    return `MI${nextId}`;
  } else {
    return "MI100";
  }
};

//create Invoice
export const createInvoice = catchAsyncError(async (req, res, next) => {
  const {
    invoiceDate,
    dueDate,
    terms,
    notes,
    placeOfSupply,
    billTo,
    shipTo,
    GSTIN,
    totalAmount,
    installments,
    invoiceItems,
    subTotal,
    igst,
    amountWitheld,
    dueAmount,
  } = req.body;

  // ✅ Validate required fields
  if (
    !invoiceDate ||
    !dueDate ||
    !billTo ||
    !invoiceItems ||
    !subTotal ||
    !totalAmount
  ) {
    return next(
      new ErrorHandler("User with this mobile number already exists", 400)
    );
  }

  //Generate custom invoice ID
  const customInvoiceId = await generateCustomInvoiceId();

  const invoice = new Invoice({
    invoiceDate,
    dueDate,
    terms,
    notes,
    placeOfSupply,
    billTo,
    shipTo,
    GSTIN,
    totalAmount,
    installments,
    invoiceItems,
    subTotal,
    igst,
    amountWitheld,
    dueAmount,
    customInvoiceId, // 👈 Include generated ID
  });

  const savedInvoice = await invoice.save();

  res.status(201).json({
    message: "Invoice created successfully",
    data: savedInvoice,
  });
});

//get all invoice
export const getAllInvoice = catchAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.status(200).json({
    invoices,
  });
});

//get single invoice
export const getASingleInvoice = catchAsyncError(async (req, res, next) => {
  

  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.status(200).json({
    invoice,
  });
});

//edit a invoice
export const editInvoice = catchAsyncError(async (req, res, next) => {
  const invoiceId = req.params.id;

  // Check if invoice exists
  const existingInvoice = await Invoice.findById(invoiceId);
  if (!existingInvoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  // Destructure only allowed fields (sanitization)
  const {
    invoiceDate,
    dueDate,
    terms,
    notes,
    placeOfSupply,
    billTo,
    shipTo,
    GSTIN,
    totalAmount,
    installments,
    invoiceItems,
    subTotal,
    igst,
    amountWitheld,
    dueAmount,
  } = req.body;

  // Basic validation — require essential fields if they are being updated
  if (
    !invoiceDate ||
    !dueDate ||
    !billTo ||
    !invoiceItems ||
    !subTotal ||
    !totalAmount
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields to update invoice" });
  }

  // Update fields
  existingInvoice.invoiceDate = invoiceDate;
  existingInvoice.dueDate = dueDate;
  existingInvoice.terms = terms;
  existingInvoice.notes = notes;
  existingInvoice.placeOfSupply = placeOfSupply;
  existingInvoice.billTo = billTo;
  existingInvoice.shipTo = shipTo;
  existingInvoice.GSTIN = GSTIN;
  existingInvoice.totalAmount = totalAmount;
  existingInvoice.installments = installments;
  existingInvoice.invoiceItems = invoiceItems;
  existingInvoice.subTotal = subTotal;
  existingInvoice.igst = igst;
  existingInvoice.amountWitheld = amountWitheld;
  existingInvoice.dueAmount = dueAmount;

  const updatedInvoice = await existingInvoice.save();

  res.status(200).json({
    message: "Invoice updated successfully",
    updatedInvoice,
  });
});

//delete invoice
export const deleteInvoice = catchAsyncError(async (req, res, next) => {
  const deleted = await Invoice.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Invoice not found" });
  res.status(200).json({
    message: "Invoice deleted succesfully",
  });
});
