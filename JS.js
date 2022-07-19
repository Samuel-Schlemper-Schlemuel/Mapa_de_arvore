const width = Math.max(window.innerWidth - 300, 1000)
const height = Math.max(window.innerHeight - 340, 700)
const grafico = d3.select('#grafico')

const svg = grafico.append('svg')
                   .attr('width', width)
                   .attr('height', height)

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').then(data => {

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const treeMap = d3.treemap()
                      .size([width, height])
                      .padding(1)

    const root = d3.hierarchy(data)
                   .sum(d => d.value)

    const node = treeMap(root)

    const arvore = svg.selectAll('g')
                      .data(node.leaves())
                      .enter()
                      .append('g')
                      .attr('transform', d => `translate(${d.x0}, ${d.y0})`)

    const tile = arvore.append('rect')
                       .attr('class', 'tile')
                       .attr('data-name', d => d.data.name)
                       .attr('data-category', d => d.data.category)
                       .attr('data-value', d => d.data.value)
                       .attr('width', d => d.x1 - d.x0)
                       .attr('height', d => d.y1 - d.y0)
                       .style('fill', d => color(d.data.category))
                       .on('mouseover', function(d, i){
                            d3.select(this)
                              .style('fill', 'black')

                            d3.select('body')
                              .append('div')
                              .attr('id', 'tooltip')
                              .attr('data-value', d.data.value)
                              .style('top', d3.event.pageY + 'px')
                              .style('left', d3.event.pageX + 50 + 'px')
                              .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
 
                                $(document).mousemove(
                                    function (event) {
                                        try{
                                            document.getElementById('tooltip').style.top = event.pageY - 30 + 'px'
                                            document.getElementById('tooltip').style.left = event.pageX + 40 + 'px'
                                        } catch {
                                            
                                        }
                                });
                        })
                       .on('mouseout', function(d, i){
                            d3.select(this)
                              .style('fill', color(d.data.category))

                            const div = document.getElementById('tooltip')
                            div.parentNode.removeChild(div)
                       })

    arvore.append('text')
          .selectAll('tspan')
          .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/))
          .enter()
          .append('tspan')
          .attr('class', 'text')
          .attr('x', 5)
          .attr('y', (d, i) => 15 + i * 15)
          .text(d => d)

    const categories = root.leaves().map(object => object.data.category).filter((itm, index, arr) => arr.indexOf(itm) === index)
    const blockSize = 25
    const legendWidth = 200
    const legendHeight = (blockSize + 2)*categories.length
    
    const legend = d3.select('#legend')
                     .append('svg')
                     .attr('width', legendWidth)
                     .attr('height', legendHeight) 

    legend.selectAll('rect')
          .data(categories)
          .enter()
          .append('rect')
          .attr('class', 'legend-item')
          .attr('x', blockSize / 2)
          .attr('y', (d, i) => i * (blockSize + 1) + 10)
          .attr('width', blockSize)
          .attr('height', blockSize)
          .style('fill', d => color(d))

    legend.append('g')
          .selectAll('text')
          .data(categories)
          .enter()
          .append('text')
          .attr('x', blockSize * 2)
          .attr('y', (d, i) => i * (blockSize + 1) + 25)
          .text(d => d)

})