const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");

class crudRespository{    

    constructor(model){
        this.model = model;
    }

    async create(data){
        const response = await this.model.create(data);
        return response;
    }

    async destroy(data){
        // console.log(`control reaches before`);
        
        const response = await this.model.destroy({
            where: {
                id: data
            }
        })
        console.log(`the delete response is ${response}`);
        if(!response){
            console.log(`the control reaches here`);
            throw new AppError('Airplane does not exist', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(){
        const response = await this.model.findAll();
        return response;
    }

    async getByPK(id){
        const response = await this.model.findByPk(id);
        // console.log(`PK Response is ${response}`);
        if(!response){
            throw new AppError('Airplane does not exist', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data){
            
        const response = await this.model.update(data, {
            where:{
                id: id
            }
        });

        // console.log(`response is ${response}`);
        
        // there is an error here
        // if(!response)    doesn't works but   if(response == 0) works
        if(response == 0){
            // console.log(`the thread reaches here`);
            throw new AppError('Airplane does not exist', StatusCodes.NOT_FOUND);
        }
        
        return response;
    }

}

module.exports = crudRespository;