
import { Request, Response, NextFunction} from 'express';
import z, { ZodError } from 'zod'

import { zUserSchema } from '../services/userSchema'
import { zEventShema } from '../services/eventSchema';
type errType = {
    errors:[{message:string}]
}
export const verifyUser = async (req: Request, res: Response, next:NextFunction) => {

    try{
        zUserSchema.parse(req.body);
        next();
    }catch(err){
        let e = err as errType
        return res.status(400).send(e.errors[0].message)
        
        
    }

}

export const verifyEvent = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(req.body.event) {zEventShema.parse(req.body.event)}else{
            zEventShema.parse(req.body);
        }
        
        next();
    }catch(err){
        let e = err as errType
        return res.status(400).send(e.errors[0].message)
        
    }
}
