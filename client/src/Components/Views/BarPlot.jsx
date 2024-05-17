import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarPlot = ({ rawdata, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!rawdata || rawdata.length === 0) return;

    const data = getFreq(rawdata);
    
    // Sort data in descending order of publications values
    const sorted = data.slice().sort((a, b) => b.count - a.count);
    const sortedData = sorted.slice(0,10);
    
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();

    // Define margins
    const margin = { top: 20, right: 20, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(sortedData.map(d => d.value))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .nice()
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale).tickSize(0);

    const yAxis = d3.axisLeft(yScale);

    const barplotGroup = svg.append('g')
      .attr('class', 'barplot-group')
      .attr('transform', 'translate(70, 20)');

    barplotGroup.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');

    barplotGroup.append('g')
      .call(yAxis);

    barplotGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Publications');

    barplotGroup.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.value))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.count))
      .attr('fill', '#93C572');

  }, [rawdata, width, height]);

   //functions
   const getFreq = (data) => {
    //remove Unknown value
    const filtered = data.filter(d=> (d.country !== "Unknown"));
    const counts = {};
    // Iterate over the array
    filtered.forEach(item => {
        const propertyValue = item.country;
        if (counts[propertyValue]) {
            counts[propertyValue]++;
        } else {
            counts[propertyValue] = 1;
        }
    });
    const countsArray = Object.entries(counts).map(([value, count]) => ({ value, count }));
    return countsArray;
  }

  return <svg ref={svgRef} width={width} height={height} />;
};

export default BarPlot;
