
import { Request, Response, NextFunction} from 'express';
import { jwtType } from '../types/jwtType';
const jwt = require('jsonwebtoken');


export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ auth: false, message: 'O usúario precisa estar logado.' });

    try{
        await jwt.verify(token, process.env.SECRET, (err:Error, verified:jwtType) => {
            if(err){ return res.status(401).send("Usuário não autorizado")}
            next();
        })
    }catch(error){
        res.status(401).send(error);
    }
    
}