
import { Request, Response, NextFunction} from 'express';
import User from '../models/User';
import Partner from '../models/Partner';

export const verifyStatusMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const user = await User.findOne({ email: req.body.email })
    const partner = await Partner.find({ email: req.body.email })
    if(user?.checked){
        next()
    }else if(partner){
        next()

    }
    else{
        res.status(400).send('Este usúrario não está ativo.')
    }
}