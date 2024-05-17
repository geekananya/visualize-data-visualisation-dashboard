import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data, width, height }) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();

    // Define margins
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.relevance)])
      .range([innerHeight, 0])
      .nice();

    // Create axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    // Draw axes
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis);

    // Draw dots
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.intensity) + margin.left)
      .attr('cy', d => yScale(d.relevance) + margin.top)
      .attr('r', 5)
      .style('fill', '#FFBF00')
      .on('mouseover', (event, d) => {
        setTooltip(d);
      })
      .on('mouseout', () => {
        setTooltip(null);
      });

    // Tooltip
    if (tooltip) {
      const tooltipWidth = 100;
      const tooltipHeight = 50;

      svg
        .append('rect')
        .attr('class', 'tooltip')
        .attr('x', xScale(tooltip.intensity) + margin.left - tooltipWidth / 2)
        .attr('y', yScale(tooltip.relevance) + margin.top - tooltipHeight - 10)
        .attr('width', tooltipWidth)
        .attr('height', tooltipHeight)
        .style('fill', 'white')
        .style('stroke', 'black');

      // svg.append("text")
      //   .attr("x", width/2)
      //   .attr("y", 20)
      //   .attr("text-anchor", "middle")
      //   .style("font-size", "16px")
      //   .text("Awesome Barchart");

      svg
        .append('text')
        .attr('class', 'tooltip-text') 
        .attr('x', xScale(tooltip.intensity) + margin.left)
        .attr('y', yScale(tooltip.relevance) + margin.top - 20)
        .attr('text-anchor', 'middle')
        .text(`title: ${tooltip.topic}`+`\n`+`(${tooltip.intensity}, ${tooltip.relevance})`);
    }
  }, [data, width, height, tooltip]);

  return (<svg ref={svgRef} width={width} height={height} />);
};

export default ScatterPlot;

