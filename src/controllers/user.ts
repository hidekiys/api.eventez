
import { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import dotenv from 'dotenv';
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
import { nanoid } from 'nanoid'
import sharp from 'sharp'
const fs = require('fs')
import multer from 'multer'
import Event from '../models/Event';
const axios = require('axios');

import User from '../models/User';
import Partner from '../models/Partner';
import { storage } from "../data/firebase";
import {ref,  uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { newNotification } from './notifications';
import Financial from '../models/Financial';
import Budget from '../models/Budget';
import { jwtType } from '../types/jwtType';

export const getUserController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const userLogin = await User.findById(decoded.userId);
        return res.json({
           "id": userLogin?._id,
           "firstName": userLogin?.name.firstName,
           "lastName": userLogin?.name.lastName,
           "events": userLogin?.events,
           "email": userLogin?.email,
           "url_avatar": userLogin?.url_avatar
       })
    })
}

export const confirmRegisterController = async (req:Request, res:Response) => {
    const {id, validation} = req.body;

    try{
        const user = await User.findById(id)
        if(user?.validation == validation){ await user?.updateOne({$set:{checked:true}});; return res.status(200).send('Liberado!')}
        return res.status(400).send("O código inserido está incorreto")
        
    }catch(err){
        console.log(err)
        res.status(400).send('Este usúario não existe!')
    }
    
    
}

export const registerUserController = async (req:Request, res:Response) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS_EMAIL

        },
        
    })
    console.log('não tentou')



    try {
        const { name , email, password } = await req.body; // catch the name, email and password from body of req
        const user = await User.findOne({ email }) //try browse the email in database
        console.log('tentou')
        


        if (!user) { // if the user exists
            const hashedPassword = await hash(password, 10); //hash the password
            const validationId = nanoid(6);
            await User.create({ name, email, password: hashedPassword, checked:false, validation: validationId }); //create this user on db

            const newUser = await User.findOne({ email })
            const configEmail = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: "Cole o código no Site para confirmar seu email.",
                
                html:`    
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                            body {
                                margin: 0;
                                padding: 0;

                            }
                            .divp {
                                height: 100%;
                                width: 100%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            img {
                                width: 150px;
                            }
                            h1{
                                font-size: 30px;
                                text-align: center;
                            }
                            p{
                                font-size: 20px;
                            }
                            .code{
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                            }
                            .codep{
                                padding: 20px 50px 20px 50px;
                                border: solid 1px black;
                                border-radius: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="divb">
                            <h1>Seja bem vindo a <img src="cid:logo"/></h1>
                            <br>
                            <p>Caso não seja você apenas ignore este email, caso seja 
                                cole este código no Site da EventEz</p>
                            <div class="code">
                                <p class="codep">${validationId}</p>
                                    
                            </div>
                        </div>
                    </body>`,
                    attachments:
                    [
                        {
                            filename: 'logo.jpg',
                            path: __dirname+'/logo.jpg',
                            cid:'logo'
                        }
                    ]
                        }

            transporter.sendMail(configEmail, (error:Error) => {
                if (error){
                    console.log('erro no 500 '+error)
                    return res.status(500).send()
                    
                }
                console.log(`email enviado para: ${email}`)
            })

            console.log("veio aqui")
            return ( //return to the front-end this message
            res.status(201).json({"id":newUser?.id})
            
        );
        }else{ // if user don't exists
            return res.status(400).send("Este usúario já existe");
        }

    }catch(error){
        console.log(error)
        return (
            res.status(500).send(error)
    );
    }
}

export const registerPartnerController = async (req:Request, res:Response) => {
    try {
        const { name , email, password } = await req.body; // catch the name, email and password from body of req
        const partner = await Partner.findOne({ email }) //try browse the email in database
        console.log('tentou')
        


        if (!partner) { // if the user exists
            const hashedPassword = await hash(password, 10); //hash the password
            await Partner.create({ name, email, password: hashedPassword }); //create this user on db
            return res.send('criado com sucesso')
        }else{ // if user don't exists
            return res.status(400).send("Este usúario já existe");
        }

    }catch(error){
        console.log(error)
        return (
            res.status(500).send(error)
    );
    }
}

export const loginUserController = async (req:Request, res:Response) => {

    try{
        const { email, password } = await req.body; // catch the email and password of body
        const userLogin = await User.findOne({ email }); // brownse in db the email
        const partnerLogin = await Partner.findOne({ email });
        console.log("passou por aqui")

        if (userLogin){ // if found the email
            if(userLogin.checked == false) {
                return res.status(203).json({
                    "msg":"Verifique o email",
                    "id":userLogin.id
                })
            }
            compare(password, userLogin.password).then(function(result) { //compare the crypt password with the password of body, then
                if(result){ //if password compare its true
                     const token = jwt.sign({userId: userLogin.id}, process.env.SECRET, { //sign the jwt for send to user
                        expiresIn: 60 * 60 * 2
                    })
                    return res.json({auth: true, //send to user
                         token,
                         "id": userLogin?._id,
                         "firstName": userLogin?.name.firstName,
                         "lastName": userLogin?.name.lastName,
                         "events": userLogin?.events,
                         "document": userLogin?.document,
                         "email": userLogin?.email,
                         "url_avatar": userLogin?.url_avatar,
                         "role": "user"
                    })}
                
                if(!result){return ( //if password compare its false
                    res.status(401).send("A senha ou o usuário está incorreto")
                    
                )}
            }
            )
            
         }else if(partnerLogin){
             compare(password, partnerLogin.password).then(async function (result) { //compare the crypt password with the password of body, then
                 if(result){ //if password compare its true
                      const token = jwt.sign({userId: partnerLogin.id}, process.env.SECRET, { //sign the jwt for send to user
                         expiresIn: 60 * 60 * 2
                    })
                    await Event.find().then(async (events)=>{
                        const eventsFilter = events.filter((filter)=> filter.services?.some((service)=> service.partnerId == partnerLogin?.id))
                        const partnerEvents = await Promise.all(eventsFilter.map(async (data, index)=>{
                            const dataService = data.services?.find((service)=>service.partnerId == partnerLogin?.id)
                            const owner = await User.findById(data.owner)
                            if(owner && dataService){
                                return {
                                    "value": dataService?.value,
                                    "eventId": data.id,
                                    "ownerName": owner?.name.firstName+' '+owner?.name.lastName,
                                    "eventName": data.name,
                                    "services": dataService?.services,
                                    "description": dataService?.description
                                }
                            }
            
                        }))
                        return res.json({auth: true, //send to user
                            token,
                            "id": partnerLogin?._id,
                            "name": partnerLogin?.name,
                            "events": partnerEvents,
                            "email": partnerLogin?.email,
                            "url_avatar": partnerLogin?.url_avatar,
                            "role":"partner"
                       })
                    })
                    
                }
                
                if(!result){return ( //if password compare its false
                    res.status(401).send("A senha ou o usuário está incorreto")
                    
                )}
            })
            
        
            
            
        }else{
                return res.status(401).send("A senha ou o usuário está incorreto");

            }
            


            }catch(error){
                console.log(error)
    }
}

export const putUserInfo = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { name, email, phone, document } = req.body
    

    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        await User.findByIdAndUpdate(decoded.userId, {$set:{
            name:name,
            email:email,
            phone:phone,
            document
        }}).then(() => {
            return res.status(202).send('Informações alteradas com sucesso')
        }).catch((err) => {
            return res.status(500).send(err)
        })

    
    })
}

export const putUserAddress = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { address } = req.body
    console.log('passou aqui')
    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        await User.findByIdAndUpdate(decoded.userId, {$set:{address}}).then(() => {
            return res.status(202).send('Endereço alterado com sucesso')
        }).catch((err) => {
            return res.status(500).send(err)
        })

    
    })
}

export const putUserAvatar = async (req: Request, res: Response) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        return decoded.userId
    }).then(async(id:string) => {const user = await User.findById(id)
        if(user){
        
            
        
            if(!req.file || (req.file && !req.file.mimetype.includes('image'))){
                return res.status(400).send("Nenhuma imagem recebida.")
            }
            
            await sharp(req.file?.path)
            .resize(300, 300, {fit: 'cover'})
            .toBuffer((err,data) => {
                const storageRef = ref(storage, `profileImages/${user._id+'.jpg'}`)
                const uploadTask = uploadBytesResumable(storageRef, data)
    
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        
                    },
                    error => {
                        console.log(error)
                        return res.status(400).send(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then( async (url)  => {
                            fs.unlink(`./uploads/${req.file?.filename}`, function(err:Error){
                                if(err) console.log(err);
                            });
                            await User.findByIdAndUpdate(id, {$set:{url_avatar:url}})
                            return res.status(200).json({"url_avatar":url}).send()
                            
                        })
                    }
                )
                if(err){
                    return res.status(400).send('Erro ao carregar a imagem para o banco de dados')
                }
            }
        
        )


        }

    


}

)
    

    

}

export const getAddressController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const userLogin = await User.findById(decoded.userId);
        return res.json({
           "cep": userLogin?.address?.cep,
           "street": userLogin?.address?.street,
           "number": userLogin?.address?.addressNumber,
           "state": userLogin?.address?.state,
           "neighborhood": userLogin?.address?.neighborhood,
           "city":userLogin?.address?.city
       })
    })
}

export const getPhoneController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const userLogin = await User.findById(decoded.userId);
        return res.json({
           "phone": userLogin?.phone
       })
    })
}
export const getDocumentController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const userLogin = await User.findById(decoded.userId);
        return res.json({
           "document": userLogin?.document
       })
    })
}

export const getUserAvatarController = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const userLogin = await User.findById(decoded.userId);
        return res.json({
           "url_avatar": userLogin?.url_avatar
       })
    })


}

export const putRequestBudget = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const { eventId, services, partnerId, description } = req.body;

    const decoded = jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        
        try{
            await Partner.findById(partnerId).then(async (partner)=>{
                await Event.find().then(async (events)=>{
                    const eventsFilter = events.filter((filter)=> filter.services?.some((service)=> service.partnerId == partner?.id))
                    const event = eventsFilter.filter((key)=>key.id == eventId)
                    if(event && event?.length > 0) {
                        return res.status(423).send('Este parceiro já trabalha neste evento!');
                    }
                    
                })
                
            }).catch((err)=>{
                console.log(err)
                return res.status(423).send('Este parceiro já trabalha neste evento!')
            })

            await Budget.create({
                users:{
                    user:decoded.userId,
                    partner:partnerId,
                },
                event:eventId,
                service:{
                    services:services,
                    description:description,
                },
                budgetDescription:"",
                value:0,
                status:{
                    user:"requested",
                    partner:"request"
                },
                created: new Date()
            })
                const users = {sender:decoded.userId, receiver:partnerId}
                const notifications = {
                    type:"contract",
                    event:eventId,
                    users
                }
                newNotification(notifications)
            return res.status(200).send('orçamento solicitado com sucesso!')
        }catch (err){
            console.log(err)
            return res.status(400).send('ocorreu um erro')
        }

    })
}

export const newPaymentMethod = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const { card } = req.body;

    jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const user = await User.findById(decoded.userId);
        if(!user) return res.status(400).send('Usuário não encontrado')
        const options = {
            method: 'POST',
            url: 'https://sandbox.api.pagseguro.com/tokens/cards',
            headers: {
              accept: '*/*',
              Authorization: process.env.PAGBANK_TOKEN,
              'content-type': 'application/json'
            },
            data:{
                number:card.number,
                exp_month:card.exp_month,
                exp_year:card.exp_year,
                security_code:card.security_code,
                holder:{
                    name:user.name.firstName+' '+user.name.lastName,
                    tax_id:user.document
                }

            }
          };
          type responsePix = {
            data:{
                id:string,
                last_digits:string,
                brand:string
            }
          }
          axios
            .request(options)
            .then(async function (response:responsePix) {
              console.log(response.data);
              user.updateOne({$push:{cards:{token:response.data.id, lastNumbers:response.data.last_digits,brand:response.data.brand}}})
              
              res.status(200).json(response.data)
            })
            .catch(function (error:Error) {
              console.error(error);
              res.status(400).json(error)
            });




    })
}


export const getUserBudgets = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}

        await Budget.find().then((budgets)=>{
            const budgetsFilter = budgets.filter((filter)=>filter.users.user == decoded.userId)
            return res.status(200).json(budgetsFilter)
        }).catch((err)=>{
            console.log(err);
            return res.status(400).send('Ocorreu um erro!');
        })




    })
}


