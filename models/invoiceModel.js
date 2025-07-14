import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    customInvoiceId: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    terms: {
      type: String,
    },
    notes: {
      type: String,
    },
    placeOfSupply: {
      type: String,
    },
    billTo: [
      {
        name: {
          type: String,
        },
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        pinCode: {
          type: String,
        },
        country: {
          type: String,
        },
        gst: {
          type: String,
        },
      },
    ],
    shipTo: [
      {
        name: {
          type: String,
        },
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        pinCode: {
          type: String,
        },
        country: {
          type: String,
        },
        gst: {
          type: String,
        },
      },
    ],
    GSTIN: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    installments: [
      {
        name: {
          type: String,
        },
        amount: {
          type: Number,
        },
        description: {
          type: String,
        },
      },
    ],
    invoiceItems: [
      {
        item: {
          type: String,
        },
        hsn: {
          type: String,
        },
        qty: {
          type: Number,
        },
        rate: {
          type: Number,
        },
        amount: {
          type: Number,
        },
      },
    ],
    subTotal: {
      type: Number,
    },
    igst: {
      type: Number,
    },
    amountWitheld: {
      type: Number,
    },
    dueAmount: {
      type: Number,
    },
  },
  { timestamps: true }
); // adds createdAt and updatedAt automatically

export const Invoice = mongoose.model("INVOICE", schema);
