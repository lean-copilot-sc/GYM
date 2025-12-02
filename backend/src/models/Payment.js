import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  invoiceUrl: String,
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'paid' },
  method: { type: String, enum: ['card', 'cash', 'bank', 'online'], default: 'card' }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
