import Event from "../models/Event";
import User from "../models/User";
import Partner from "../models/Partner";
import { Request, Response} from 'express'
import { jwtType } from "../types/jwtType";
import Reviews from "../models/Reviews";
import { ReviewType } from "../services/reviewsSchema";
const jwt = require('jsonwebtoken');


export const getReviews = async (req:Request, res:Response) => {
    const { partnerId } = req.params
    try{
            await Reviews.find().then(async (reviews)=>{
                const partnerReviews = reviews.filter((filter)=>filter.partnerId == partnerId)
                const data = await Promise.all(partnerReviews.map(async (key)=>{
                    const writer = await User.findById(key.writer);
                        if(writer){
                                return {
                                    reviewId:key.id,
                                    writer: {
                                        name:(writer.name.firstName)+" "+ (writer.name.lastName ? writer.name.lastName : ""),
                                        avatar:writer.url_avatar ?? ""
                                    },
                                    text:key.text,
                                    rate:key.rate,
                                    createdAt:key.createdAt,
                                }

                    }

                }))
                const filterData = data.filter((review)=> review != null);
                return res.status(200).json(filterData);
            })
        
    }catch{
        return res.status(400).send('ocorreu um erro!')
    }
}

export const postReview = async (req:Request, res:Response) => {
    type ReviewBodyType = {
        partnerId:string,
        text:{
            title:string,
            description:string
        },
        rate:number
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const reviewBody:ReviewBodyType = req.body.reviewBody;

    try{
        jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
            if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
            if(reviewBody){
                await Reviews.create({
                    writer: decoded.userId,
                    partnerId:reviewBody.partnerId,
                    text:{
                        title:reviewBody.text.title,
                        description:reviewBody.text.description
                    },
                    rate:reviewBody.rate
                }).then(async()=>{
                    const allReviews = await Reviews.find()
                    const partnerReviews:ReviewType[] = allReviews.filter((filter)=>filter.partnerId == reviewBody.partnerId);
                    await Partner.findById(reviewBody.partnerId).then(async (partner)=>{
                        if(partner != null){
                            if(partner.rate){
                                var num = 0
                                partnerReviews.forEach((pReviews, i)=>{
                                    if(pReviews){
                                        num+=pReviews.rate
                                        console.log('num:'+num)
                                    }
                                })
                                const newRate = num/partnerReviews.length
                                console.log(newRate)
                                await partner.updateOne({rate:newRate}).then(()=>{
                                    return res.status(200).send('Review criado com sucesso!')
                                });
                            }else{
                                await partner.updateOne({rate:reviewBody.rate}).then(()=>{
                                    return res.status(200).send('Review criado com sucesso!')
                                });
                            }
                            
                        }
                    })
                })

            }
        })
    }catch{

    }
}