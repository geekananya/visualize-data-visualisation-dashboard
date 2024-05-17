import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const StackedBarPlot = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    //prepare Data
    //aggregation
    const aggregatedData = d3.rollups(
      data,
      group => ({
        pestle: group[0].pestle,
        v1: d3.mean(group, d => d.intensity),
        v2: d3.mean(group, d => d.relevance),
        v3: d3.mean(group, d => d.impact)
      }),
        d => d.pestle
      );
      // console.log(aggregatedData);
      
      const stackedData = aggregatedData.map((d, i) => {
        // console.log(d);
        return {
          pestle: aggregatedData[i][0], // 'Pestle' value
          v1: d[1].v1, // Value for 'v1'
          v2: d[1].v2, // Value for 'v2'
          v3: d[1].v3, // Value for 'v3'
        };
    });
    // console.log(stackedData);
    // Transpose data for stacked bar chart
    const transposedData = d3.stack()
    .keys(['v1','v2','v3'])
    .offset(d3.stackOffsetNone)
    (stackedData);
    
    // console.log(transposedData);
    
    // Define margins
    const margin = { top: 20, right: 20, bottom: 100, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();
    
    const stackedGroup = svg.append('g')
      .attr('class', 'stacked-group')
      .attr('transform', 'translate(50, 10)');

    const xScale = d3.scaleBand()
      .domain(aggregatedData.map(d => d.pestle))
      .range([0, innerWidth])
      .paddingInner(0.1)
      .paddingOuter(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(transposedData[transposedData.length - 1], d => d[1])])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain([Object.keys(aggregatedData[0]).slice(1)])
      .range(d3.schemeCategory10);

    const xAxis = d3.axisBottom(xScale).ticks(0);

    const yAxis = d3.axisLeft(yScale);

    const tickValues = aggregatedData.map(d => d[0]);
    const barWidth = 40, padding=5;

    stackedGroup.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickValues(tickValues))
      .selectAll('text')
      .attr('transform', (d, i) =>`translate(${2+(barWidth*i)}, 0) rotate(-45)`) // Adjust position and rotation of tick labels
      .style('text-anchor', 'end')

    stackedGroup.append('g')
      .call(yAxis);

    stackedGroup.selectAll('.series')
      .data(transposedData)
      .enter().append('g')
      .attr('fill', d => colorScale(d.key))
      .attr('class', 'series')
      .attr('transform', 'translate(4,0)')
      .selectAll('rect')
      .data(d => d) // Bind each n ested data array to the rectangles
      .enter().append('rect')
      .attr('x', d => xScale(d.data.pestle))
      .attr('y', d =>yScale(d[1])) // Use the upper bound for the y-position
      .attr('height', d => yScale(d[0]) - yScale(d[1])) // Compute the height based on the stacked values
      .attr('width', barWidth-(2*padding)) // Use bandwidth to set the width of each bar   
      .attr('transform', (d, i) =>`translate(${barWidth*i}, 0)`); 

      
      
      //legend
      const legendData = ['Intensity', 'Relevance', 'Impact'];


      // Add legend
      const legend = stackedGroup.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(25, ${innerHeight + 65})`); // Adjust the Y translation as needed
  
      // Add rectangles for legend items
      const radius = 10;
      const legendSpacing = 4;
      legend.selectAll('.legend-item')
        .data(legendData)
        .enter()
        .append('circle')
        .attr('class', 'legend-item')
        .attr('radius', radius)
        .attr('r', radius / 2) // Radius of the circle
        .attr('cx', radius / 2) // Center x-coordinate of the circle
        .attr('cy', (d, i) => i * (legendSpacing + radius)) // Center y-coordinate of the circle
        .attr('fill', d => colorScale(d));

      // Add text labels for legend items
      legend.selectAll('.legend-text')
        .data(legendData)
        .enter()
        .append('text')
        .attr('class', 'legend-text')
        .attr('x', radius + 4)
        .attr('y', (d, i) => i * (radius + legendSpacing-1)) // Adjust vertical position
        .attr('dy', '0.35em')
        .text(d => d);




  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default StackedBarPlot;
