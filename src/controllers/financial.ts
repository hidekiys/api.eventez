
import { FinancialType } from "../services/FinancialSchema";
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import User from '../models/User';
import Event from '../models/Event';
import Partner from '../models/Partner';
import Financial from '../models/Financial';
import Budget from '../models/Budget';
import { jwtType } from "../types/jwtType";
const axios = require('axios');





export const getPartnerFinancial = (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        await Financial.find().then((financial)=>{
            const financialFilter = financial.filter((filter)=>filter.users.partner == decoded.userId);
            return res.status(200).json(financialFilter);
        }).catch((err)=>{
            console.log(err);
            return res.status(400).send('Ocorreu um erro ao tentar achar o financeiro');
        })



    })
}
export const getEventFinancial = (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { eventId } = req.params;

    jwt.verify(token, process.env.SECRET, async (err:Error, decoded:jwtType)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        await Financial.find().then((financial)=>{
            const financialFilter = financial.filter((filter)=>filter.event == eventId);
            return res.status(200).json(financialFilter);
        }).catch((err)=>{
            console.log(err);
            return res.status(400).send('Ocorreu um erro ao tentar achar o financeiro');
        })



    })
}