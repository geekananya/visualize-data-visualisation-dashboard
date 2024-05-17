import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Heatmap = ({ rawdata, width, height }) => {
  const svgRef = useRef();

  // Define margins
  const margin = { top: 20, right: 20, bottom: 60, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (!rawdata || rawdata.length === 0) return;

    const data = rawdata.slice(0,50)
    // Aggregation
    const aggregatedData = d3.rollups(
      data,
      group => ({
        topic: group[0].topic,
        impact: d3.mean(group, d => d.impact),
        relevance: d3.mean(group, d => d.relevance),
        intensity: d3.mean(group, d => d.intensity), 
        likelihood: d3.mean(group, d => d.likelihood)
      }),
      d => d.topic
    );

    // Flatten the aggregated data for heatmap visualization
    const flattenedData = aggregatedData.map(([topic, values]) => [topic, values.impact, values.relevance, values.intensity, values.likelihood]);

    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();
  
    // Define color scale
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain([d3.max(flattenedData.flat().slice(1)), 0]);

    // Define scales for x and y axes
    const xScale = d3.scaleBand()
      .domain(flattenedData.map(d => d[0]))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(['impact', 'relevance', 'intensity', 'likelihood'])
      .range([0, innerHeight])
      .padding(0.1);

    const heatmapGroup = svg.append('g')
      .attr('class', 'heatmap-group')
      .attr('transform', 'translate(60, 10)');

    ['impact', 'relevance', 'intensity', 'likelihood'].forEach((variable, i) => {
        heatmapGroup.selectAll(`.${variable}-rect`)
          .data(data)
          .enter().append('rect')
          .attr('x', d => xScale(d.topic)+2)
          .attr('y', innerHeight - (i + 1) * (yScale.bandwidth()+6)) // Adjust y position for each variable
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .attr('fill', d => colorScale(d[variable]))
          .attr('class', `${variable}-rect`);
      });

    // Add x-axis label
    heatmapGroup.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 60)
      .attr('text-anchor', 'middle')
      .text('TOPIC');

    // Add x-axis
    heatmapGroup.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text') 
      .attr('text-anchor', 'end') 
      .attr('transform', 'rotate(-45)'); 

    // Add y-axis
    heatmapGroup.append('g')
      .call(d3.axisLeft(yScale).tickValues(['impact', 'relevance', 'intensity', 'likelihood']));

  }, [rawdata, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

export default Heatmap;
