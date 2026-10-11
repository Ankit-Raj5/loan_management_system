import { HydratedDocument, Model, Schema, Types, model } from "mongoose";

export interface IPayment {
  loan: Types.ObjectId;
  utr: string;
  amount: number;
  paymentDate: Date;
  recordedBy: Types.ObjectId;
  recordedByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentDocument = HydratedDocument<IPayment>;

const paymentSchema = new Schema<IPayment>(
  {
    loan: { type: Schema.Types.ObjectId, ref: "LoanApplication", required: true, index: true },
    utr: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    paymentDate: { type: Date, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recordedByName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> = model<IPayment>("Payment", paymentSchema);
