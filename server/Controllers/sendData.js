import {getData} from '../Models/dbOps.js'

const filteredData = async (req, res, db) => {
    let query = {};
    
    if (req.query.intensity) {
      query.intensity = parseInt(req.query.intensity);
    }
    if (req.query.relevance) {
      query.relevance = parseInt(req.query.relevance);
    }
    if (req.query.likelihood) {
      query.likelihood = parseInt(req.query.likelihood);
    }
    if (req.query.start_year) {
      query.start_year = parseInt(req.query.start_year);
    }
    if (req.query.end_year) {
      query.end_year = parseInt(req.query.end_year);
    }
    // if (req.query.add_date) {
    //   query.add_date = new Date(req.query.add_date);
    // }
    if (req.query.published_date) {
      query.published_date = new Date(req.query.published_date);
    }
    if (req.query.sector) {
      query.sector = req.query.sector;
    }
    if (req.query.country) {
      query.country = req.query.country;
    }
    if (req.query.topic) {
      query.topic = req.query.topic;
    }
    if (req.query.region) {
      query.region = req.query.region;
    }
    if (req.query.pestle) {
      query.pestle = req.query.pestle;
    }
    if (req.query.source) {
      query.source = req.query.source;
    }

    try{
      // console.log(req.query.add_date);
      // const d = new Date(req.query.date_added);
      // console.log(d)
        const result = await getData(db, query);
        console.log("got the data")
        res.json(result);
    }catch(e){
      console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default filteredData;