import User from '@/models/User';
import {Inngest} from 'inngest';
import {connectDB} from './db';
import Order from '@/models/Order';

export const inngest = new Inngest({id:"inngest-next"})




export const userCreate = inngest.createFunction(
    {id:"user-create"},
    {
        event:"clerk/user.created",
    },
    async ({event}) => {
        const {id , first_name , last_name , email_addresses , image_url} = event.data;
        const user = {
            _id:id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url ,

        }
        await connectDB();
        await User.create(user);
    }

)


export const userUpdate = inngest.createFunction({
    id:"user-update",
},
   { event:"clerk/user.updated"},
   async ({event}) => {
        const {id , first_name , last_name , email_addresses , image_url} = event.data;
        const user = {
            _id:id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url ,
        }
        await connectToDB();
        await User.findByIdAndUpdate(id, user, {new:true});
   }
)
export const userDelete = inngest.createFunction(
    
    {id:"user-delete"},
    {
        event:"clerk/user.deleted"},
    async ({event}) => {
        const {id} = event.data;
        await connectToDB();
        await User.findByIdAndDelete(id);
    }

)

export const creatOrder = inngest.createFunction({
    id:"order-create",
    batchEvents:{
        maxSize:20,
        timeout:"5s"
    }
},
{event:"order/create"},
async ({events}) => {
    const orders = events.map(e => {
        return {
            user: e.data.userId,
            items: e.data.items,
            amount: e.data.amount,
            address: e.data.address,
            date:event.data.date,
        }
    });
    await connectDB();
    await Order.insertMany(orders);

    return{ success:true , processed: orders.length}
}
)