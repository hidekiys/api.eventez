import { updateMetadata } from "firebase/storage";
import Chat from "../models/Chat";
import User from "../models/User";
import Partner from "../models/Partner";
import { newNotification } from "./notifications";

const jwt = require('jsonwebtoken');



export const sendMsg = async (req, res) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try{
        jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
            if(err){return res.status(500).send('Token fornecido não foi autorizado.')}


            const { to, message } = req.body;
            if(!to || !message) return res.status(400).send('preencha os campos corretamente!');
            const data = await Chat.create({
                message: {text:message},
                users: [decoded.userId, to],
                sender: decoded.userId,
            })
            if(data){
                newNotification({
                    type:"chat",
                    users:{
                        receiver:to,
                        sender:decoded.userId
                    },
                })
            }
            
            if(data) return res.status(201).send('Mensagem adicionada com sucesso!');
            return res.status(400).send('Falha ao adcionar mensagem.');



        })




    }catch(err){
        console.log(err)
    }


}

export const getAllChats = async (req, res) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try{
        jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
            if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
            let jsonn:string
            await User.findById(decoded.userId).then( async (user)=>{
                if(user && user.chats != undefined){
                    let data: {name:string,id:string}[] = [{name:'',id:''}]

                    for(let i=0; i<user.chats.length;i++){
                        const otherUser = await User.findById(user.chats[i])
                        if(user.chats && otherUser != null){
                            
                            data[i] = {name:otherUser?.name.firstName+' '+otherUser?.name.lastName, id:user.chats[i]}
                        }else if(user.chats){
                            await Partner.findById(user.chats[i]).then((otherUser)=>{
                                if(user.chats && otherUser){
                                   data[i] = {name:otherUser.name, id:user.chats[i]}
                                }
                            })
                        }
                    
                        
                        
                    }
                    return res.status(200).json(data)

                }else{
                    Partner.findById(decoded.userId).then( async (user)=>{
                        if(user && user.chats != undefined){
                            let data: {name:string,id:string}[] = [{name:'',id:''}]
        
                            for(let i=0; i<user.chats.length;i++){
                                const otherUser = await User.findById(user.chats[i])
                                if(user.chats && otherUser != null){
                                    
                                    data[i] = {name:otherUser?.name.firstName+' '+otherUser?.name.lastName, id:user.chats[i]}
                                }else if(user.chats){
                                    await Partner.findById(user.chats[i]).then((otherUser)=>{
                                        if(user.chats && otherUser){
                                           data[i] = {name:otherUser.name, id:user.chats[i]}
                                        }
                                    })
                                }
                            
                                
                                
                            }
                            return res.status(200).json(data)
                        }
                })
                


        }})



    })
    }catch(err){
        console.log(err)
    }
}


export const getAllMessages = async (req, res) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try{
        jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
            if(err){return res.status(500).send('Token fornecido não foi autorizado.')}


            const { to } = req.params;
            if(!to) return res.status(400).send('preencha os campos corretamente!');
            const messages = await Chat.find({
                users:{
                    $all: [decoded.userId, to],
                }
            })
            .sort({updatedAt: 1});

            const me = await Partner.findById(decoded.userId) || await User.findById(decoded.userId)
            if(messages.length == 0 && me?.chats?.filter((chat)=>chat==to).length == 0){
                const userOne = await User.findByIdAndUpdate(decoded.userId, {$push:{chats:to}}) || await Partner.findByIdAndUpdate(decoded.userId, {$push:{chats:to}})
                const userTwo = await User.findByIdAndUpdate(to, {$push:{chats:decoded.userId}}) || await Partner.findByIdAndUpdate(to, {$push:{chats:decoded.userId}})
            }

            const projectedMessages = messages.map((msg)=>{
                return {
                    fromSelf:msg.sender.toString() === decoded.userId,
                    message: msg.message.text,
                }
            });
            res.status(200).json(projectedMessages);


        })




    }catch(err){
        console.log(err)
    }


}