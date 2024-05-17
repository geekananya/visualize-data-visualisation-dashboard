import {getDistinctValues} from '../Models/dbOps.js'

const distinctValues = async (req, res, db) => {
    try{
        const result = await getDistinctValues(db);
        res.json(result);
    }catch(e){
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default distinctValues;