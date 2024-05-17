import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CircularBarplot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set dimensions and margins
    const margin = { top: 100, right: 0, bottom: 0, left: 0 };
    const width = 460 - margin.left - margin.right;
    const height = 460 - margin.top - margin.bottom;
    const innerRadius = 90;
    const outerRadius = Math.min(width, height) / 2;

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // X scale: Common for both data series
    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(data.map(d => d.country));

    // Y scale for outer variable (intensity)
    const yOuter = d3.scaleRadial()
      .range([innerRadius, outerRadius])
      .domain([0, d3.max(data, d => d.intensity)]);

    // Y scale for inner variable (relevance)
    const yInner = d3.scaleRadial()
      .range([innerRadius, 5]) // Adjust the inner radius as needed
      .domain([0, d3.max(data, d => d.relevance)]);


      // Append a group for outer bars
      const outerBarsGroup = svg.append('g')
      .attr('class', 'outer-bar');

      // Append a group for inner bars
      const innerBarsGroup = svg.append('g')
      .attr('class', 'inner-bar');

      // Append a group for country labels
      const countryLabelsGroup = svg.append('g')
      .attr('class', 'country-label');


    // Add outer bars
    outerBarsGroup.selectAll('.outer-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'outer-bar')
      .attr('x', d => x(d.country))
      .attr('y', d => yOuter(d.intensity))
      .attr('width', x.bandwidth())
      .attr('height', d => outerRadius - yOuter(d.intensity))
      .style('fill', 'steelblue');

    // Add inner bars
    innerBarsGroup.selectAll('.inner-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'inner-bar')
      .attr('x', d => x(d.country))
      .attr('y', d => yInner(d.relevance))
      .attr('width', x.bandwidth())
      .attr('height', d => innerRadius - yInner(d.relevance))
      .style('fill', 'orange');

    // Add labels for country values
    countryLabelsGroup.selectAll('.country-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'country-label')
      .attr('x', d => x(d.country))
      .attr('y', outerRadius + 10) // Adjust label position
      .text(d => d.country)
      .style('text-anchor', 'middle');

    // Additional styling and customization can be done as needed

    svg.append('g')
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', d => `rotate(${x(d.country) * 180 / Math.PI - 90})`)
      .selectAll('rect')
      .data(d => [
        { type: 'intensity', value: d.intensity },
        { type: 'relevance', value: d.relevance }
      ])
      // .join('rect')
      // .attr('x', d => yOuter(0))
      // .attr('y', (d, i) => (i === 0) ? -yOuter(d.value) : innerRadius)
      // .attr('width', yOuter.bandwidth())
      // .attr('height', d => Math.abs(yOuter(0) - yOuter(d.value)))
      // .attr('fill', (d, i) => (i === 0) ? 'steelblue' : 'orange');

    svg.append('g')
      .call(x);

    svg.append('g')
      .call(yOuter);
      
    svg.append('g')
      .call(yInner);

    svg.node();


  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CircularBarplot;
