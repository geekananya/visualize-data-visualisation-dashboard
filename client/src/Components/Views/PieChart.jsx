import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const PieChart = ({ rawdata, width, height }) => {
    
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    
  useEffect(() => { 
      if (!rawdata || rawdata.length === 0) return;
  
      // Define margins
      const margin = { top: 20, right: 20, bottom: 20, left: 80 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

    const data = getFreq(rawdata);
    const slicedData = data.slice(0,10);  //top 10
    
    const svg = d3.select(svgRef.current);
    // Clear previous render
    svg.selectAll('*').remove();
    const radius = Math.min(innerWidth, innerHeight) / 2;

    // Define a color scale
    const color = d3.scaleOrdinal(d3.schemeSet2);

    // Define the pie layout
    const pie = d3.pie().value(d => d.count);

    // Define the arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Create a group element for the pie chart
    const pieGroup = svg.append('g')
      .attr('class', 'pie-group')
      .attr('transform', `translate(${(innerWidth/2)+margin.left-2*margin.right}, ${innerHeight / 2})`);

    // Draw the pie slices
    const arcs = pieGroup.selectAll('.arc')
      .data(pie(slicedData))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.7);
        setTooltip(d);
        setTooltipPosition({x: event.clientX, y: event.clientY})
        // Show tooltip or perform hover effect
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('opacity', 1);
        setTooltip(null);
        // Hide tooltip or reset hover effect
      });

  }, [rawdata, width, height]);


  //functions
  const getFreq = (data) => {
    const counts = {};
    // Iterate over the array
    data.forEach(item => {
        const propertyValue = item.source;
        if (counts[propertyValue]) {
            counts[propertyValue]++;
        } else {
            counts[propertyValue] = 1;
        }
    });
    const countsArray = Object.entries(counts).map(([value, count]) => ({ value, count }));
    return countsArray;
  }
  
  function getPercentage(d){
    return Math.round((d.endAngle - d.startAngle)*(100/6.28));
  }


  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
      {tooltip && 
        <div className='ba' style={{ position: 'absolute', left: tooltipPosition.x, top: tooltipPosition.y, zIndex: 99 }}>
          <p className='ma0'>{tooltip.data.value}</p>
          <p className='ma0'>{getPercentage(tooltip)}%</p>
        </div>
      }
    </div>
  );
};

export default PieChart;