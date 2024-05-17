import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import close from '../assets/close.svg'
import { count } from 'd3';


const Filter = (props) => {

  const [allValues, setAllValues] = useState({country:[], source: [], topic:[], sector:[], pestle:[], region:[]});
  const navigate = useNavigate();
  
  const country = useRef();
  const source = useRef();
  const topic = useRef();
  const sector = useRef();
  const pestle = useRef();
  const region = useRef();
  const published = useRef(); //date
  const start_year = useRef(); //date
  const end_year = useRef(); //date
  const date_added = useRef(); //date

  useEffect(()=>{
    fetchValues();
  }, [])

  const fetchValues = async () =>{
    const res = await fetch('/api/data/distinct');
    const values = await res.json();
    // console.log(values.source);
    setAllValues(values);
    //fetch all countries, topics, sectors, regions, pest, SWOTTT, source, city, publish_year etc
  }

  function submitFilters(event){
    event.preventDefault(); // Prevent the default form submission behavior
    
    const filters={};
    filters.country = country.current.value;
    filters.source = source.current.value;
    filters.topic = topic.current.value;
    filters.sector = sector.current.value;
    filters.pestle = pestle.current.value;
    filters.region = region.current.value;
    filters.published = published.current.value; //date
    filters.start_year = start_year.current.value; //date
    filters.end_year = end_year.current.value; //date
    filters.date_added = date_added.current.value; //date

    //re-route
    navigate('/dashboard', {state: {filters}});
  }


  
  return (
    <div className="fixed top-0 left-0 w-100 h-100 flex items-center justify-center bg-black-80 z-999">
      <div className="bg-white pa4 shadow-5 mw-100 w-50">
        <div className='flex justify-end align-start'>
          <h2 className="mb4 mt3 ml-auto mr-auto tc">Filters</h2>
          <img src={close} alt='close' 
            width={40} height={40} 
            className='o-30 pointer'
            onClick={()=>navigate('/dashboard')}>
          </img>
        </div>
        <form onSubmit={submitFilters}>
          <div className='container flex flex-wrap justify-center'>
            <div className="mb4 mr3 mw-25">
              <label htmlFor="filter1" className="db mb2">Source</label>
              <select id="filter1" ref={source} className="w-100 pa2 truncate">
                {
                  allValues.source.map(v=>{
                    return <option value={v}>{v}</option>;
                  })
                }
              </select>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter2" className="db mb2">Country</label>
              <select id="filter2" ref={country} name="country" className="w-100 pa2">
                {
                  allValues.country.map(v=>{
                    return <option value={v}>{v}</option>;
                  })
                }
              </select>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter3" className="db mb2">Region</label>
              <select id="filter3" ref={region} className="w-100 pa2">
                {
                  allValues.region.map(v=>{
                    return <option value={v}>{v}</option>;
                  })
                }
              </select>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter4" className="db mb2">Topic</label>
              <select id="filter4" ref={topic} className="w-100 pa2">
                {
                  allValues.topic.map(v=>{
                    return <option value={v}>{v}</option>;
                  })
                }
              </select>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter5" className="db mb2">Pestle</label>
              <select id="filter5" ref={pestle} className="w-100 pa2">
                {
                  allValues.pestle.map(v=>{
                    return <option value={v}>{v}</option>;
                  })
                }
              </select>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter6" className="db mb2">Sector</label>
              <select id="filter6" ref={sector} className="w-100 pa2">
                {
                  allValues.sector.map(v=>{
                    return <option value={v}>{v}</option>;
                  })
                }
              </select>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter7" className="db mb2">End Year</label>
              <input type="number" min="1900" max="2099" step="1" ref={end_year}/>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter8" className="db mb2">Start Year</label>
              <input type="number" min="1900" max="2099" step="1" ref={start_year}/>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter9" className="db mb2">Publish Year</label>
              <input type="number" min="1900" max="2099" step="1" ref={published}/>
            </div>
            <div className="mb4 mr3">
              <label htmlFor="filter10" className="db mb2">Date added (On or Before)</label>
              <input type="date" min="1900" max="2099" step="1" ref={date_added}/>
            </div>
          </div>
          <div className='tc'>
            <button type='submit' className="button pl4 pr4 pt2 pb2">Add Filters</button>
          </div>
        </form> 
      </div>
    </div>
  );
}

export default Filter;
