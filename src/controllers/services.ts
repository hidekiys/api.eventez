
import { Request, Response } from 'express';
import Partner from '../models/Partner';




export const getServicesPagination = async (req:Request, res:Response) => {
    const { page } = req.params;
    try{
        let p = 1
        if(page) p=parseInt(page)
        const partner = await Partner.find().sort()
        const skipPages = [p * 12, p-1*12]
        const pagination = partner.slice(skipPages[1], skipPages[0])
        const data = pagination.map((key,index)=>{
                return{
                    id:key.id,
                    name:key.name,
                    avatar:key.url_avatar,
                    types:key.types,
                    local:key.local
                }
    })
        return res.status(200).json(data)
    }catch{
        return res.status(400).send('Ocorreu um erro!')
    }

    
}

export const getFamousServices = async (req:Request, res:Response) => {
    try{

        const partner = await Partner.find().sort()

        const filter = partner.filter((key)=>key.types.includes("Famosos"))
        if(filter){
            const data = filter.map((key,index)=>{
            return{
                id:key.id,
                name:key.name,
                avatar:key.url_avatar,
                types:key.types,
                local:key.local,
                images:key.images
            }
})
        return res.status(200).json(data)}
    }catch{
        return res.status(400).send('Ocorreu um erro!')
    }
}

export const getPlaces = async (req:Request, res:Response) => {
    try{

        const partner = await Partner.find().sort()

        const filter = partner.filter((key)=>key.types.includes("Espaço"))
        if(filter){
            const data = filter.map((key,index)=>{
            return{
                id:key.id,
                name:key.name,
                avatar:key.banner,
                types:key.types,
                local:key.local
            }
})
        return res.status(200).json(data)}
    }catch{
        return res.status(400).send('Ocorreu um erro!')
    }
}

export const getServiceType = async (req:Request, res:Response) => {
    const { type } = req.params;
    try{
        const partner = await Partner.find().sort()

        const filter = partner.filter((key)=>key.types.includes(type))
        if(filter){
            const data = filter.map((key,index)=>{
            return{
                id:key.id,
                name:key.name,
                avatar:key.url_avatar,
                types:key.types,
                local:key.local
            }
})
        return res.status(200).json(data)}
    }catch{
        return res.status(400).send('Ocorreu um erro!')
    }
}

export const searchServices = async (req:Request, res:Response) => {
    const { search } = req.params;
    try{
        
        
        const searchReplaced = search.replace("+", " ")
        const find = await Partner.find({
            "$or":[
                {name:{$regex:searchReplaced, $options: 'i'}},
                {types:{$regex:searchReplaced, $options: 'i'}},
            ]
        }).sort()


        if(find){
            const data = find.map((key,index)=>{
            return{
                id:key.id,
                name:key.name,
                avatar:key.url_avatar,
                types:key.types,
                local:key.local
            }
})
        return res.status(200).json(data)}
    }catch{
        return res.status(400).send('Ocorreu um erro!')
    }
}