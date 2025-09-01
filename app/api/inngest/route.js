import { serve } from "inngest/next";
import {creatOrder, inngest , userCreate , userDelete , userUpdate} from '@/config/inngest';

export const { GET, POST } = serve( {
    client: inngest,
    functions: [
        userCreate,
        userUpdate,
        userDelete,
        creatOrder
    ]
})