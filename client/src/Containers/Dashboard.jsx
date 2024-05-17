import {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom'
import Card from '../Components/Card'
import Navbar from './Navbar'
import ScatterPlot from '../Components/Views/ScatterPlot'
import Lolipop from '../Components/Views/Lolipop';
import Heatmap from '../Components/Views/Heatmap';
import PieChart from '../Components/Views/PieChart';
import DonutChart from '../Components/Views/DonutChart';
import BarPlot from '../Components/Views/BarPlot';
import StackedBarPlot from '../Components/Views/StackedBarChart';
import loading from '../assets/loading.gif'
import './Themes.css';

export default function Dashboard(){

    const [data, setData] = useState(null);

    const filters = useLocation().state;
    // console.log(filters);

    useEffect(() => {
        fetchData(applyFilters());
    }, [filters]);
    
    const fetchData = async (query) => {
        const response = await fetch(`/api/data?${query}`);
        const jsonData = await response.json();
        const correctedData = handleMissingData(jsonData);
        setData(correctedData);
        // setFilteredData(correctedData); // Initialize filteredData with all data
    };

    const applyFilters = () =>{
        if(filters){
            const query = `country=${filters.filters.country}&source=${filters.filters.source}&sector=${filters.filters.sector}&topic=${filters.filters.topic}&region=${filters.filters.region}&pestle=${filters.filters.pestle}&start_year=${filters.filters.start_year}&end_year=${filters.filters.end_year}&published=${filters.filters.publicated}&date_added=${filters.filters.date_added}`;
            console.log(query)
            return query;
        }
        return "";
    }


    const handleMissingData = (jsondata)=>{
        //set arbitrary defaults
        const filledData = jsondata.map(d => ({
            ...d,
            intensity: !isNaN(d.intensity) ? d.intensity : 0,
            relevance: !isNaN(d.relevance) ? d.relevance : 0,
            likelihood: !isNaN(d.likelihood) ? d.likelihood : 2.5,
            impact: !isNaN(d.impact) ? d.impact : 0,
            country: d.country !== "" ? d.country : "Unknown",
            topic: d.topic !== "" ? d.topic : "Unknown",
            source: d.source !== "" ? d.source : "Unknown",
            sector: d.sector !== "" ? d.sector : "Unknown",
            pestle: d.pestle !== "" ? d.pestle : "Unknown",
            region: (d.region !== "" && d.region !== "world") ? d.region : "World",
        }));
        return filledData;
    }


    return (
        <div className='pa4 pt0 flex-auto overflow-y-auto tc'>
            <Navbar/>
            {
            (data)? ((data.length !==0) ? <>
                    <Card>
                        <div><Lolipop data={data} width={'350'} height={'300'}/></div>
                    </Card>
                    <Card>
                        <div><h2 className='mt2'>Top 10 Sources</h2><PieChart rawdata={data} width={'300'} height={'250'} /></div>
                    </Card>
                    <Card>
                        <div><h3 className='mb0'>Which sectors have the most articles?</h3><p className='mb0 mt0'>Hover to see.</p><DonutChart rawdata={data} width={'300'} height={'250'} /></div>
                    </Card>
                    <Card>
                        <div><h3>Topic-Wise parameters</h3><Heatmap rawdata={data} width={'500'} height={'400'} /></div>
                    </Card>
                    <Card>
                        <div><StackedBarPlot data={data} width={'500'} height={'500'} /></div>
                    </Card>
                    <Card>
                        <div><h3 className='ma0'>Publications of top 10 Countries</h3><BarPlot rawdata={data} width={'500'} height={'300'} /></div>
                    </Card>
                    <Card>
                        <div><h2>Relevance vs Intensity</h2>
                            <ScatterPlot data={data} width={'300'} height={'250'}/>
                        </div>
                    </Card>
                </>
                : <>
                    <h1>No data found!</h1>
                    <NavLink to="/filter">
                        <button className='pointer mt4 br3 b--blue'><p className='f3 mt2 mb2'>Edit Filters</p></button>
                    </NavLink>
                </>)
                : <img src={loading} alt='loading data'></img>
            }
        </div>
    )
}