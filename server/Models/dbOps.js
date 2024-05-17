export async function getData(db, filter){
  // console.log(added)
  //   filter.added = {$lt: added};
  //   console.log("query", filter)
    try {
        const documents = await db.collection("Data").find(filter).toArray();
        console.log("got db data")
        return documents;
    } catch (error) {
        console.error('Error:', error);
        throw new Error(e);
    }
}

export const getDistinctValues = async (db) => {
    let values={}, docs;
    try{
        docs = await db.collection("Data").aggregate([
            { $group: { _id: "$country" } },
            { $sort: { _id: 1 } }
          ]).toArray();
        values.country = docs.map(({ _id }) => _id);

        docs = await db.collection("Data").aggregate([
            { $group: { _id: "$topic" } },
            { $sort: { _id: 1 } }
          ]).toArray()
        values.topic = docs.map(({ _id }) => _id);

        docs = await db.collection("Data").aggregate([
            { $group: { _id: "$pestle" } },
            { $sort: { _id: 1 } }
          ]).toArray()
        values.pestle = docs.map(({ _id }) => _id);

        docs = await db.collection("Data").aggregate([
            { $group: { _id: "$source" } },
            { $sort: { _id: 1 } }
          ]).toArray()
        values.source = docs.map(({ _id }) => _id);

        docs = await db.collection("Data").aggregate([
            { $group: { _id: "$sector" } },
            { $sort: { _id: 1 } }
          ]).toArray()
        values.sector = docs.map(({ _id }) => _id);

        docs = await db.collection("Data").aggregate([
            { $group: { _id: "$region" } },
            { $sort: { _id: 1 } }
          ]).toArray()
        values.region = docs.map(({ _id }) => _id);

        return values;
    }catch(e){
        console.log("Error:", e);
        throw new Error(e);
    }
}