
import { Response, Request, NextFunction } from 'express';
import { getContract } from '../services/blockchain';
import storeMultipleFiles from '../lib/documents';
import { sequelize, QueryTypes } from '../services/postgres'; 

const getAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const contract = await getContract();
        const rawAsset = await contract.evaluateTransaction("getAssetById", id);
        const asset = JSON.parse(rawAsset.toString());

        return res.send({ asset });

    } catch (error) {
        next(error)
    }
};

const storeFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files: any = req.files;
        const response = await storeMultipleFiles(files);
        
        return res.send(response);
        
    } catch (error) {
        next(error)
    }

};

const getDataFromTable = async (req: Request, res: Response, next: NextFunction) => {
    
    const response = await sequelize.query("SELECT * FROM table", { type: QueryTypes.SELECT });
        
    return res.send(response);
};


export default {
    getAsset,
    storeFiles,
    getDataFromTable
};



