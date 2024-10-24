import { Request, Response, NextFunction} from 'express';
import Partner from '../models/Partner';
import { compare } from 'bcrypt';
const jwt = require('jsonwebtoken');

export const verifyPartnerPassMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}

        const { pass } = await req.body; // catch the email and password of body
        const partner = await Partner.findById( decoded.userId ); // brownse in db the email
        
        if (partner){ // if found the email
            compare(pass, partner.password).then(function(result) {
                if(result){
                    next()
                }
                if(!result){
                    return res.status(401).send('A senha está incorreta, alterações não foram salvas!')
                }
            })
        
        
        }
    })
}