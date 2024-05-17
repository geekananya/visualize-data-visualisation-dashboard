import fs from 'fs';
const docs = JSON.parse(fs.readFileSync('./Models/jsondata.json', 'utf-8'))

const importData = async (db) => {
    try{
        const result = await db.collection("Data").insertMany(docs);
        console.log(`${result.insertedCount} documents were inserted`);
    }catch(e){
        console.log("err inserting", e);
    }
}

export default importData;