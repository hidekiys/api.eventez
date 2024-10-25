
import Event from "../models/Event";
import Notifications from "../models/Notifications"
import { Request, Response} from 'express'
import User from "../models/User";
import Partner from "../models/Partner";
import { jwtType } from "../types/jwtType";

const jwt = require('jsonwebtoken');

export type NotificationsType = {
    type:string,
    event?:string,
    users:{
        sender:string,
        receiver:string,
    },
}

export const newNotification = async ({type,event,users}:NotificationsType) => {
    await Notifications.find({}).sort({updatedAt:1}).then(async (find)=>{
        const data = find.filter((filter)=> filter.users.receiver == users.receiver && filter.users.sender == users.sender && filter.notificationType == type)
        if(data.length>0) {return}else{
        await Notifications.create({
            notificationType:type,
            users,
            event
        })
    }
    })
    

}

export const getNotifications = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try{
        jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
            if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
  await Notifications.find().sort({updatedAt: -1}).then( async(find)=>{
        let data: any = find.filter((filter)=> filter.users.receiver == decoded.userId)
        
        
        for (let i=0;i<data.length;i++){
            const event = await Event.findById(data[i].event)
            if(data[i].notificationType != "eventDay"){
                const user = await User.findById(data[i].users.sender) ?? await Partner.findById(data[i].users.sender)
                data[i] ={
                    event:[data[i].event, event],
                    sender:[data[i].users.sender, (user?.name?.firstName || user?.name)],
                    notificationType:data[i].notificationType,
                    updatedAt: data[i].created
                }
            }else{
                data[i] ={
                    event:[data[i].event, event],
                    sender:["eventEz", "EventEz"],
                    notificationType:data[i].notificationType,
                    updatedAt: data[i].created
                }
            }
        }
        if(data) return res.status(200).json(data)
        
    })
        })
    }catch{
        return res.status(400).send('Ocorreu um erro ao tentar carregar as notificações!')
    }

}