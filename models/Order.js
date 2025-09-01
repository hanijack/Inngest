import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: String, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    address:{type:String, required:true},
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
    date: { type: Number, required:true}
})


const Order = mongoose.models.Order || mongoose.model('order', orderSchema);
export default Order;