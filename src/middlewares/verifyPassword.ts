import { Request, Response, NextFunction} from 'express';
import User from '../models/User';
import { compare } from 'bcrypt';
const jwt = require('jsonwebtoken');

export const verifyPassMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}

        const { pass } = await req.body; // catch the email and password of body
        const user = await User.findById( decoded.userId ); // brownse in db the email
        
        if (user){ // if found the email
            compare(pass, user.password).then(function(result) {
                if(result){
                    console.log('passou')
                    next()
                }
                if(!result){
                    console.log('não passou')
                    return res.status(401).send('A senha está incorreta, alterações não foram salvas!')
                }
            })
        
        
        }
    })
}