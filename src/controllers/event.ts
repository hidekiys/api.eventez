import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import User from '../models/User';
import Event from '../models/Event';
import Partner from '../models/Partner';
import Financial from '../models/Financial';
import Budget from '../models/Budget';
const axios = require('axios');

export const createNewEventController = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { name, date, numberOfGuests, hour, endTime } = await req.body


    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const userEvents = await Event.exists({ owner:decoded.userId, name })
        
        if(userEvents) return res.status(400).send("Você já possui um evento com este nome")

        Event.create({ name, owner:decoded.userId, date, numberOfGuests, hour, endTime, status:"preparing" }).then(async()=>{
            const event = await Event.findOne({owner: decoded.userId, name})
            await User.updateOne({_id: decoded.userId}, {$push: {events:event?.id}})


            return res.status(201).json({"id":event?.id,
                "message":"Evento criado com sucesso!"
            })
        }).catch((err) => {
            return res.status(500).send('Não foi possível criar o evento')
        })
    
    
    })
}

export const editEventController = async(req: Request, res:Response) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { name, types, place, date, time, numberOfGuests, description, id, endTime, publicOfEvent } = await req.body.event
    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const event = await Event.find({ owner:decoded.userId, _id:id })
        
        if(event.length === 0) return res.status(400).send('Este evento não existe')
        
        await Event.findOneAndUpdate({ owner:decoded.userId, _id:id }, {...event, name, types, place, date, time, numberOfGuests, description, endTime, publicOfEvent  }).then(()=>{
            return res.status(200).send('O evento alterado com sucesso')
        }).catch(err => {
            return res.status(500).send('Não foi possível alterar o evento')
        })

    })

}

export const getEventsController = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const events = await Event.find({ owner:decoded.userId })
        try{
            return res.status(200).json(events)
        }catch (err){
            console.log(err+'DEU ERRO')
            return res.status(400).send(err)
        }
       
        
        

    })
}

export const getEventInfoController = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const id = req.headers.eventid;

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        await User.findById(decoded.userId).then(async (user) => {
            if(!user?.events?.includes(id as string)) {
                await Partner.findById(decoded.userId).then(async (partner)=>{
                    await Event.find().then((events)=>{
                        if(events.filter((filter)=> filter.services?.some((service)=> service.partnerId == partner?.id)).length == 0) return res.status(404).json("404 Evento não encontrado")
                    })
                })
                
 
        }})
        const event = await Event.findById(id)
        
       
        
        try{
            return res.status(200).json(event)
        }catch (err){
            
        }
       
        
        

    })
}

export const getEventSummaryController = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const id = req.headers.eventid;

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const event = await Event.findById(id)
        const user = await User.findById(event?.owner)
        
        try{
            return res.status(200).json({
                "numberOfGuests": event?.numberOfGuests,
                "publicOfEvent": event?.publicOfEvent,
                "types": event?.types,
                "date":event?.date,
                "name":event?.name,
                "owner":user?.name.firstName+' '+user?.name.lastName,
                "initialTime":event?.hour,
                "endTime":event?.endTime,
                "place":event?.place,
                "ownerId":event?.owner,
                "status":event?.status,
                
            })
        }catch (err){
            
        }
       
        
        

    })
}

export const deleteEvent = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const id = req.body.eventId;
    

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{

        
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}

        try{
            const deleteEvent = await Event.findByIdAndDelete(id)
            const user = await User.findById(decoded.userId)
            const events = await user?.events?.filter((event)=> event != id)
            const deleteEventFromUser = await user?.updateOne({events:events});
            return res.status(200).send()
        }catch (err){
            console.log(err+' DEU ERRO')
            return res.status(400).send()
        }
       
        
        

    })
}

export const deleteTodoController = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const {id, itemId} = req.body.event;

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{

        
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        try{
            const event = await Event.findById(id)
                if(event?.todoList){
                    const deleteItem = event?.todoList.filter((todoItem)=> todoItem.todoItem != itemId)
                    await event.updateOne({todoList:deleteItem})
                    return res.status(200).send('Deletado com sucesso')
                }
                
            
            
        }catch (err){
            console.log(err+' DEU ERRO')
        }
       
        
        

    })
}

export const checkTodoItemController = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const {id, itemId} = req.body.event;

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{

        
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}

        try{
            const event = await Event.findById(id)
                if(event?.todoList){
                    const todoUpdate = event?.todoList
                    

                    for(let i=0; i< todoUpdate.length; i++){
                        if(todoUpdate[i].todoItem == itemId){
                            todoUpdate[i].status = (todoUpdate[i].status == true) ? false : true;

                        }
                        
                    }
                    await event.updateOne({todoList:todoUpdate})
                    return res.status(200).send('Checkado')
                    
                    
                }

                
            
            
        }catch (err){
            console.log(err+' DEU ERRO')
        }
       
        
        

    })
}

export const createNewTodoItemController = async(req: Request, res:Response) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { description, id } = await req.body.event

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}


        const existEvent = await Event.find({ owner:decoded.userId, _id:id })
        if(existEvent.length === 0) return res.status(400).send('Este evento não existe');

        const event = await Event.findOne({owner:decoded.userId, _id:id}).then((event) => {
            if(event?.todoList){
            const todoLength = event?.todoList.length as number + 1
            
            Event.findOneAndUpdate({ owner:decoded.userId, _id:id }, {$push:{todoList:{todoDescription:description, todoItem:todoLength, status:false}}}  ).then(()=>{
                return res.status(200).send('O evento alterado com sucesso')
            }).catch(err => {
                return res.status(500).send('Não foi possível alterar o evento')
            })
        }
        })




    })

}

export const getPartnerName = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const id = req.headers.partnerid

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(id);
        return res.json(partner?.name)
    })
}

export const putContractService = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    type BodyType = {
        eventId:string,
        partnerId:string
        budgetId:string,
        paymentMethod:string,
    }
    
    const { eventId, budgetId, partnerId, paymentMethod }:BodyType = req.body;
    
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        try{
            const user = await User.findById(decoded.userId)
            const event = await Event.findById(eventId)
            const partner = await Partner.findById(partnerId)



            const partnerBudget = await Budget.findById(budgetId)

            if(!user) return res.status(400).send('usuário não encontrado')
            if(paymentMethod == "pix") {
                console.log(partnerBudget)
            const options = {
                method: 'POST',
                url: 'https://sandbox.api.pagseguro.com/orders',
                headers: {
                accept: '*/*',
                Authorization: process.env.PAGBANK_TOKEN,
                'content-type': 'application/json'
                },
                data: {
                customer: {
                    name: user.name.firstName+' '+user.name.lastName,
                    email: user.email,
                    tax_id: user.document,
                    phones: [{country: 55, area: user.phone?.slice(0,2), number: user.phone?.slice(2,11), type:"MOBILE"}]
                },
                reference_id: partnerBudget?._id,
                items: [{
                        name: 'servico',
                        quantity: 1,
                        unit_amount: partnerBudget?.value
                    }],
                qr_codes: [{amount: {value: partnerBudget?.value}}]
                }
            };
            
            axios
                .request(options)
                .then(async function (response) {
                console.log(response.data);
                await Financial.create({
                    users:{
                        user:decoded.userId,
                        partner:partnerId
                    },
                    event:eventId,
                    service:{
                        service:partnerBudget?.service.services[0],
                        description:partnerBudget?.service.description
                    },
                    value:partnerBudget?.value,
                    status:{
                        user:"waiting payment",
                        partner:"waiting"

                    },
                    payment:{
                        paymentMethod:"pix",
                        charge:"pix",
                        order:response.data.id
                    },
                    created:new Date
                }).then(()=>{
                    return res.status(200).send(response.data)
                })
                await Budget.findByIdAndDelete(budgetId)
                
            })
            .catch(function (error) {
                console.error(error.response.data.error_messages[0].code);
                if(error.response.data.error_messages[0].code == "40002"){
                    return res.status(406).json({
                        "msg":"CPF Inválido",
                        "error":"cpf"
                    })
                }
                return res.status(400).json(error)
            });



            }else if(paymentMethod == "boleto") {
                console.log(partnerBudget)
            const options = {
                method: 'POST',
                url: 'https://sandbox.api.pagseguro.com/orders',
                headers: {
                accept: '*/*',
                Authorization: process.env.PAGBANK_TOKEN,
                'content-type': 'application/json'
                },
                data: {
                customer: {
                    name: user.name.firstName+' '+user.name.lastName,
                    email: user.email,
                    tax_id: user.document,
                    phones: [{country: 55, area: user.phone?.slice(0,2), number: user.phone?.slice(2,11), type:"MOBILE"}]
                },
                reference_id: partnerBudget?._id,
                items: [{
                        name: 'servico',
                        quantity: 1,
                        unit_amount: partnerBudget?.value
                    }],
                    charges: [
                        {
                          amount: {value: partnerBudget?.value},
                          payment_method: {type: 'BOLETO'},
                          reference_id: partnerBudget?._id
                        }
                      ]
                }
            };
            
            axios
                .request(options)
                .then(async function (response) {
                console.log(response.data);
                await Financial.create({
                    users:{
                        user:decoded.userId,
                        partner:partnerId
                    },
                    event:eventId,
                    service:{
                        service:partnerBudget?.service.services[0],
                        description:partnerBudget?.service.description
                    },
                    value:partnerBudget?.value,
                    status:{
                        user:"waiting payment",
                        partner:"waiting"

                    },
                    payment:{
                        paymentMethod:"boleto",
                        charge:"boleto",
                        order:response.data.id
                    }
                })
              
            return res.status(200).send(response.data)
            })
            .catch(function (error) {
            console.error(error.response.data);
            return res.status(400).json(error)
            });
            }

            

        //     const budgetFilter = partner?.budgets?.filter(budget => 
        //         (budget.budgetItem != budgetItem  && budget.event == eventId) || budget.event != eventId
        //     )

        //     console.log(partner?.budgets)
        //     if(partnerBudget){ 
        //         await Partner.findByIdAndUpdate(partnerId, {$push:{events:{
        //             eventId,
        //             eventName: partnerBudget?.eventName,
        //             ownerName: partnerBudget?.userName,
        //             services: partnerBudget?.services,
        //             description: partnerBudget?.description,
        //             value: partnerBudget?.value,
    
        //         }}})
        //     }else{
        //         return res.status(400).send("Solicitação não encontrada")
        //     }

            
        //     await Partner.findByIdAndUpdate(partnerId, {budgets:budgetFilter})





        //     const eventBudgetFilter = event?.budgets?.filter(budget => 
        //         (budget.budgetItem != budgetItem && budget.partnerId == partnerId) || budget.partnerId != partnerId
        //     )
        //     const eventBudget = event?.budgets?.find(budget => 
        //         budget.budgetItem == budgetItem && budget.partnerId == partnerId
        //     )

        //     if(eventBudget){ 
        //         await Event.findByIdAndUpdate(eventId, {$push:{services:{
        //             partnerId,
        //             services: eventBudget?.services,
        //             description: eventBudget?.description,
        //             value: eventBudget?.value
        //         }}})
        //     }else{
        //         return res.status(400).send("Solicitação não encontrada")
        //     }


        //     await Event.findByIdAndUpdate(eventId, {budgets:eventBudgetFilter})
            
            
        //     const users = {sender:decoded.userId, receiver:partnerId}
        //     const notifications = {
        //         type:"contract",
        //         event:eventId,
        //         users
        //     }
        //     newNotification(notifications)
        //     return res.status(201).send('orçamento criado com sucesso!')
        }catch (err){
            console.log(err)
            return res.status(400).send('ocorreu um erro')
        }

    })
}

export const getPartnerSummaryController = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const id = req.headers.partnerid;

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(id)
        
        try{
            return res.status(200).json({
                "partnerName":partner?.name
                
            })
        }catch (err){
            
        }
       
        
        

    })
}

export const getEventServices = async(req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { eventId } = req.params;

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')};
        if(!eventId) return res.status(404).send('Não foi informado o id do evento.');

        await Event.findById(eventId).then((event)=>{
            type Data = {
                partnerName:string,
                partnerId:string
            }[]
            let data: Data = [{partnerId:'',partnerName:''}]
            event && event.services?.forEach(async(service,i)=>{
                await Partner.findById(service.partnerId).then((partner)=>{
                    if(partner) data[i] = {partnerName:partner?.name, partnerId:partner?.id}


                    if(event.services && i == (event.services.length - 1)){
                        if(data[0].partnerId == '') {return res.status(400).send('não foi encontrado serviços para este evento')};
                        return res.status(200).json(data)
                    }

                })
            })

            
            
        })





        })



}
