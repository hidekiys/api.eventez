var cron = require('node-cron');
import User from '../models/User';
import Event from '../models/Event';
import Partner from '../models/Partner';
import { EventType } from './eventSchema';
import { newNotification } from '../controllers/notifications';
import Financial from '../models/Financial';
const axios = require('axios');


export const verifyEventDay = () => cron.schedule('*/20 * * * * *', async () => {
        await Event.find().then((event)=>{
            let dates:Date[] = [new Date()]
            const today = new Date()
            event.forEach(async (ev, index)=>{
                if(ev.date){
                    dates[index] = new Date(ev.date)
                    if(dates[index].getUTCDate() == today.getUTCDate() && dates[index].getMonth() == today.getMonth()  && dates[index].getFullYear() == today.getFullYear()){
                        const eId:string = ev.id
                        await event[index].updateOne({status:"inProgress"})
                        if(ev.owner){
                            const users = {sender:"eventEz",receiver:ev.owner}
                            const type:string = "eventDay"
                            newNotification({type, event:eId, users})
                            
                        }
                    }
            }
                
            })

        })
})


export const verifyPayment = () => cron.schedule('*/10 * * * * *', async () => {
    await Financial.find().then((financial)=>{
        const financialFilter = financial.filter((filter)=>filter.status.partner == "waiting")
        financialFilter.forEach(async (item, index)=>{
            const axios = require('axios');

                const options = {
                method: 'GET',
                url: `https://sandbox.api.pagseguro.com/orders/${item.payment.order}`,
                headers: {accept: '*/*', Authorization: process.env.PAGBANK_TOKEN}
                };

                axios
                .request(options)
                .then(async function (response) {
                    if(response.data.charges[0].status == undefined) return
                    if(response.data.charges[0].status == 'PAID'){
                        await Financial.findByIdAndUpdate(item._id, {status:{user:"paid", partner:"pending"}})
                        await Event.findByIdAndUpdate(item.event, {$push:{
                            services:{
                                services: item.service.service,
                                partnerId:item.users.partner,
                                description:item.service.description,
                                value:item.value,
                        }}})
                        const event = await Event.findById(item.event)
                    }
                })
                .catch(function (error) {
                    
                });
        })
    })
})
