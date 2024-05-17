import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ rawdata, width, height }) => {

  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!rawdata || rawdata.length === 0) return;

    const data = getFreq(rawdata);
    
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();

    // Define margins
    const margin = { top: 20, right: 20, bottom: 50, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const radius = Math.min(innerWidth, innerHeight) / 2;

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.value))
      .range(d3.schemePaired);

    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const donutGroup = svg.append('g')
      .attr('class', 'donut-group')
      .attr('transform', 'translate(50, 20)');

    const arcs = donutGroup.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${innerWidth / 2},${innerHeight / 2})`);

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.value))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.7);
        setTooltip(d);
        setTooltipPosition({x: event.clientX, y: event.clientY})
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('opacity', 1);
        setTooltip(null);
      });
      
    }, [rawdata, width, height]);

      //functions
    const getFreq = (data) => {
      const counts = {};
      // Iterate over the array
      data.forEach(item => {
          const propertyValue = item.sector;
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

export default DonutChart;
