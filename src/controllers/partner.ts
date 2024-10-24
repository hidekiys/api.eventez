import { Request, response, Response } from 'express';
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const fs = require('fs');
import Event from '../models/Event';
import Partner from '../models/Partner';
import User from '../models/User';
import Chat from '../models/Chat';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject  } from 'firebase/storage';
import sharp from 'sharp';
import { storage } from '../data/firebase';
import { newNotification } from './notifications';
import Budget from '../models/Budget';
interface MulterRequest extends Request {
    file: any;
}


export const getPartnerController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partnerLogin = await Partner.findById(decoded.userId);
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
        
            return res.json({
            "id": partnerLogin?._id,
            "name": partnerLogin?.name,
            "events": partnerEvents,
            "email": partnerLogin?.email,
            "url_avatar": partnerLogin?.url_avatar
        })
    })
})
}

export const getBudgetsController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(decoded.userId);
        return res.json(partner?.budgets)
    })
}

export const getNotificationsController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(decoded.userId);
        return res.json(partner?.notifications)
    })
}

export const putCreateBudget = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    type BodyType = {
        eventId:string,
        budgetId:string,
        description:string,
        value:number
    }
    
    const { eventId, budgetId, description, value }:BodyType = req.body;

    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        console.log(req.body)
        try{
                const event = await Event.findById(eventId)
                await Budget.findByIdAndUpdate(budgetId,{$set:{budgetDescription:description, value, status:{user:"received",partner:"sended"}}}).then(()=>{
                    if(event && event.owner){
                        const users = {sender:decoded.userId, receiver:event.owner}
                        const notifications = {
                            type:"budget",
                            event:eventId,
                            users
                        }
                        newNotification(notifications)
                    }
                    
                        return res.status(200).send('Orçamento criado com sucesso!')
                    }).catch((err)=>{
                        console.log(err);
                })
                
                
        }catch (err){
            console.log(err)
            return res.status(400).send('ocorreu um erro')
        }

    })
}

export const getPartnerEventsController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(decoded.userId);
        await Event.find().then(async (events)=>{
            const eventsFilter = events.filter((filter)=> filter.services?.some((service)=> service.partnerId == partner?.id))
            const data = await Promise.all(eventsFilter.map(async (data, index)=>{
                const dataService = data.services?.find((service)=>service.partnerId == partner?.id)
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
            return res.status(200).json(data)
        })
        
    })
}

export const getPartnerEventController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const id = req.headers.eventid;

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(decoded.userId).then(async (partner)=>{
            await Event.find().then(async (events)=>{
            const eventsFilter = events.filter((filter)=> filter.services?.some((service)=> service.partnerId == partner?.id))
            const data = eventsFilter.filter((event)=>event.id == id)
            if(data) return res.json(data[0])
        })
            
            
        })

    })
}

export const putPartnerAvatar = async (req: MulterRequest, res: Response) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        return decoded.userId
    }).then(async(id) => {const user = await Partner.findById(id)
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
                            fs.unlink(`./uploads/${req.file?.filename}`, function(err){
                                if(err) console.log(err);
                            });
                            await Partner.findByIdAndUpdate(id, {$set:{url_avatar:url}})
                            return res.status(200).json({"url_avatar":url}).send()
                            
                        })
                    }
                )
                if(err){
                    return res.status(400).send('Erro ao carregar a imagem para o banco de dados')
                }
            }
        
        )}
    })
}

export const putPartnerImage = async (req: MulterRequest, res: Response) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        return decoded.userId
    }).then(async(id) => {const user = await Partner.findById(id)
        if(user){
            const imageId = user.images?.length
            
        
            if(!req.file || (req.file && !req.file.mimetype.includes('image'))){
                return res.status(400).send("Nenhuma imagem recebida.")
            }
            
            sharp(req.file?.path)
                .resize(1920, 1080, { fit: 'cover' })
                .toBuffer((err, data) => {
                    const storageRef = ref(storage, `partnerImages/${user._id}/${imageId + '.jpg'}`);
                    const uploadTask = uploadBytesResumable(storageRef, data);

                    uploadTask.on(
                        "state_changed",
                        snapshot => {
                        },
                        error => {
                            console.log(error);
                            return res.status(400).send(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                                fs.unlink(`./uploads/${req.file?.filename}`, function (err) {
                                    if (err) console.log(err);
                                });
                                await Partner.findByIdAndUpdate(id, { $push: { images: url } });
                                return res.status(200).json({ "image": url }).send();

                            });
                        }
                    );
                    if (err) {
                        return res.status(400).send('Erro ao carregar a imagem para o banco de dados');
                    }
                }

                )}
    })
}

export const putPartnerBanner = async (req: MulterRequest, res: Response) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        return decoded.userId
    }).then(async(id) => {const user = await Partner.findById(id)
        if(user){
            
        
            if(!req.file || (req.file && !req.file.mimetype.includes('image'))){
                return res.status(400).send("Nenhuma imagem recebida.")
            }
            
            sharp(req.file?.path)
                .resize(1920, 1080, { fit: 'cover' })
                .toBuffer((err, data) => {
                    const storageRef = ref(storage, `partnerImages/${user._id}/banner${'.jpg'}`);
                    const uploadTask = uploadBytesResumable(storageRef, data);

                    uploadTask.on(
                        "state_changed",
                        snapshot => {
                        },
                        error => {
                            console.log(error);
                            return res.status(400).send(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                                fs.unlink(`./uploads/${req.file?.filename}`, function (err) {
                                    if (err) console.log(err);
                                });
                                await Partner.findByIdAndUpdate(id, { $set: { banner: url } });
                                return res.status(200).json({ "image": url }).send();

                            });
                        }
                    );
                    if (err) {
                        return res.status(400).send('Erro ao carregar a imagem para o banco de dados');
                    }
                }

                )}
    })
}

export const getPartnerPage = async (req: Request, res:Response) => {
    const { partnerId } = req.params;
    await Partner.findById(partnerId).then((partner)=>{
        const data = {
            name:partner?.name,
            offerServices:partner?.offerServices,
            local:partner?.local,
            url_avatar:partner?.url_avatar,
            type:partner?.types,
            about:partner?.about,
            questions:partner?.questions,
            images:partner?.images,
            rate:partner?.rate,
            reviews:partner?.reviews,
            banner:partner?.banner,
        }
        return res.status(200).json(data);
    })

}

export const getPartnerAddressController = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(decoded.userId);
        return res.json(partner?.local)
    })
}

export const getPartnerBanner = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(decoded.userId);
        return res.json(partner?.banner)
    })
}

export const getPartnerAddressPageController = async (req: Request, res:Response) => {
    const { partnerId } = req.params;

        const partner = await Partner.findById(partnerId);
        return res.json(partner?.local)
    
}

export const putPartnerAddress = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { local } = req.body
    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        await Partner.findByIdAndUpdate(decoded.userId, {$set:{local}}).then(() => {
            return res.status(202).send('Endereço alterado com sucesso')
        }).catch((err) => {
            return res.status(500).send(err)
        })

    
    })
}

export const getPartnerImages = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then((partner)=>{
            const data = partner?.images
            return res.status(200).json(data);
        })
})

}

export const getPartnerOfferServices = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then((partner)=>{
            const data = partner?.offerServices
            return res.status(200).json(data);
        })
})

}

export const deletePartnerImage = async (req: Request, res: Response) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { index } = req.params;
    const decoded = jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}
        const partner = await Partner.findById(decoded.userId)
        if(partner){
            const storageRef = ref(storage, `partnerImages/${partner._id}/${index + '.jpg'}`);
            deleteObject(storageRef).then(async ()=>{
                let data = partner.images
                if(data) data[index] = ''
                await Partner.findByIdAndUpdate(decoded.userId, {images:data}).then(()=>{
                    console.log('imagem deletada')
                    return res.status(200).send('Imagem deletada com sucesso!')
                    
                }).catch(()=>{
                    console.log('erro deletada')
                    return res.status(400).send('Erro ao deletar a imagem!')
                })
                
            }).catch(()=>{
                console.log('errp deletada')
                return res.status(400).send('Erro ao deletar a imagem!')
            })

        }else{
            console.log(decoded.userId)
        }
           

    })
        
}

export const postOfferService = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { service } = req.body;
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findByIdAndUpdate(decoded.userId, {$push:{offerServices:service}}).then(()=>{
            return res.status(200).send('Serviço criado com sucesso!')
        }).catch(()=>{
            return res.status(400).send('Ocorreu um erro ao tentar criar o serviço.')
        })
    })


}

export const putOfferService = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { index, name, description, averagePrice } = req.body;
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then(async (partner)=>{
            const offerServices = partner?.offerServices
            if(offerServices) {
                    offerServices[index] = {
                    name: name == '' ? offerServices[index].name : name,
                    description: description == '' ? offerServices[index].description : description,
                    averagePrice: averagePrice == 0 ? offerServices[index].averagePrice : averagePrice,
                }
            }
            await Partner.findByIdAndUpdate(decoded.userId, {offerServices}).then(()=>{
                return res.status(200).send('Serviço editado com sucesso!')
            }).catch(()=>{
                return res.status(400).send('Ocorreu um erro ao tentar editar o serviço.')
            })
        })


    })
}

export const deleteOfferService = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { index } = req.params;
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then(async (partner)=>{
            const offerServices = partner?.offerServices
            const nIndex = parseInt(index)
            offerServices?.splice(nIndex, 1)
            await Partner.findByIdAndUpdate(decoded.userId, {offerServices}).then(()=>{
                return res.status(200).send('Serviço excluido com sucesso!')
            }).catch(()=>{
                return res.status(400).send('Ocorreu um erro ao tentar excluir o serviço.')
            })
        })


    })


}

export const getPartnerAbout = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then((partner)=>{
            const data = partner?.about
            return res.status(200).json(data);
        })
})

}

export const putPartnerAbout = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { about } = req.body;
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findByIdAndUpdate(decoded.userId, {about}).then((partner)=>{
            return res.status(200).send('Sobre a empresa alterado com sucesso!');
        }).catch(()=>{
            return  res.status(400).send('Ocorreu um erro ao tentar editar o sobre da empresa.')
        })
})

}

export const getPartnerQuestions = async (req: Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then((partner)=>{
            const data = partner?.questions
            return res.status(200).json(data);
        })
})

}

export const postPartnerQuestion = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { question } = req.body;
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findByIdAndUpdate(decoded.userId, {$push:{questions:question}}).then(()=>{
            return res.status(200).send('Pergunta criada com sucesso!')
        }).catch(()=>{
            return res.status(400).send('Ocorreu um erro ao tentar criar a pergunta.')
        })
    })


}

export const putPartnerQuestion = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { index, ask, response } = req.body;
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then(async (partner)=>{
            const questions = partner?.questions
            if(questions) {
                    questions[index] = {
                    ask: ask == '' ? questions[index].ask : ask,
                    response: response == '' ? questions[index].response : response,
                }
            }
            await Partner.findByIdAndUpdate(decoded.userId, {questions}).then(()=>{
                return res.status(200).send('Pergunta editada com sucesso!')
            }).catch(()=>{
                return res.status(400).send('Ocorreu um erro ao tentar editar a pergunta.')
            })
        })


    })
}

export const deletePartnerQuestion = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { index } = req.params;
    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        await Partner.findById(decoded.userId).then(async (partner)=>{
            const questions = partner?.questions
            const nIndex = parseInt(index)
            questions?.splice(nIndex, 1)
            await Partner.findByIdAndUpdate(decoded.userId, {questions}).then(()=>{
                return res.status(200).send('Pergunta excluida com sucesso!')
            }).catch(()=>{
                return res.status(400).send('Ocorreu um erro ao tentar excluir a pergunta.')
            })
        })


    })


}

export const getPartnerBudgets = async (req:Request, res:Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    jwt.verify(token, process.env.SECRET, async (err, decoded)=>{
        if(err){return res.status(500).send('Token fornecido não foi autorizado.')}

        await Budget.find().then((budgets)=>{
            const budgetsFilter = budgets.filter((filter)=>filter.users.partner == decoded.userId)
            return res.status(200).json(budgetsFilter)
        }).catch((err)=>{
            console.log(err);
            return res.status(400).send('Ocorreu um erro!');
        })




    })
}