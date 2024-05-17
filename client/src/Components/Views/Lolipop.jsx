import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const Lolipop = ({ data, width, height }) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();

    // Define margins
    const margin = { top: 20, right: 50, bottom: 50, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    //remove missing pestle
    const newdata = data.filter(d => d.pestle !== "");
    //aggregating pestle fields for relevance value
    const aggregatedData = d3.rollups(
        newdata,
        v => d3.mean(v, d => d.relevance),
        d => d.pestle
      );

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d[1])])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(aggregatedData.map(d => d[0]))
      .range([0, innerHeight])
      .padding(0.1);

    const LolipopGroup = svg.append('g')
      .attr('class', 'heatmap-group')
      .attr('transform', 'translate(20, 0)');

      // Draw lines
      LolipopGroup
      .selectAll('.line')
      .data(aggregatedData)
      .enter()
      .append('line')
      .attr('class', 'line')
      .attr('x1', d => xScale(d[1]) + margin.left)
      .attr('y1', d => yScale(d[0]) + margin.top + yScale.bandwidth() / 2)
      .attr('x2', margin.left)
      .attr('y2', d => yScale(d[0]) + margin.top + yScale.bandwidth() / 2)
      .style('stroke', 'teal')
      .style('stroke-width', '1px');
      
      // Draw circles
      LolipopGroup
        .selectAll('.circle')
        .data(aggregatedData)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', d => margin.left + xScale(d[1]))
        .attr('cy', d => yScale(d[0]) + margin.top + yScale.bandwidth() / 2)
        .attr('r', 5)
        .style('fill', 'teal')
        .on('mouseover', (event, d) => {
          setTooltip(d);
        })
        .on('mouseout', () => {
          setTooltip(null);
        });
      
    // Tooltip
    if (tooltip) {
      LolipopGroup
        .append('text')
        .attr('class', 'tooltip-text')
        .attr('x', xScale(tooltip.relevance) + margin.left)
        .attr('y', yScale(tooltip.pestle) + margin.top - 5)
        .attr('text-anchor', 'middle')
        .text(tooltip.relevance);
    }

    // Draw axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale);

    LolipopGroup
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
      .call(xAxis);

    LolipopGroup.append('text')
      .attr('x', innerWidth / 2 +margin.left)
      .attr('y', innerHeight+ margin.bottom+4) // Adjust position as needed
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Relevance'); // X-axis label

    LolipopGroup
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(yAxis);

    LolipopGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', (-innerHeight / 2)-20)
        .attr('y', 0) // Adjust position as needed
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text('Pestle'); // Y-axis label

  }, [data, width, height, tooltip]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default Lolipop;
