import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
  },
  { timestamps: true }
);

const ClientModel = mongoose.model('Client', clientSchema);

export default ClientModel;
