import User from "@/models/user";
import { Inngest } from "inngest";
import { connect } from "mongoose";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "QuickCart" });
export const inngestClient = inngest.createFunction({
    id: 'sync-user-from-clerk'},
{
    event: 'user.created',
},
async ({event}) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data;
    const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        password: 'clerk'
    };
    await connectDb();
    await User.create(userData);

    
}
);

export const syncUserUpdate = inngest.createFunction({
    id: 'sync-user-update-from-clerk'},
{
    event: 'clerk/user.updated', 
},
async ({event}) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data;
    const userData = {  
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
    };
    await connectDb();
    await User.findByIdAndUpdate(id, userData);

    
}
);

export const syncUserDelete = inngest.createFunction({
    id: 'sync-user-delete-from-clerk'},
{  
    event: 'clerk/user.deleted',
},
async ({event}) => {
    const {id} = event.data;   
    await connectDb();
    await User.findByIdAndDelete(id);

    
}   
);