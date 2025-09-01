import mongoose from "mongoose";


const AddressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, 
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
})
const Address = mongoose.models.Address || mongoose.model('address', AddressSchema);
export default Address; 