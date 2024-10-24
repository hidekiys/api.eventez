import { Request, Response, NextFunction} from 'express';
const jwt = require('jsonwebtoken');


export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ auth: false, message: 'O token não foi provido.' });

    try{
        await jwt.verify(token, process.env.SECRET, (err, verified) => {
            if(err){ return res.status(401).send("Não autorizado.")}
            next();
        })
    }catch(error){
        res.status(401).send(error);
    }
    
}