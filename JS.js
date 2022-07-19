const width = 1000
const height = 800
const grafico = d3.select('#grafico')

const svg = grafico.append('svg')
                   .attr('width', width)
                   .attr('height', height)

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').then(data => {

    function color(category){
        return category == 'Action' ? 'red' : category == 'Drama' ? 'blue' : category == 'Adventure' ? 'green' : category == 'Family' ? 'purple' : category == 'Animation' ? 'yellow' : category == 'Comedy' ? 'pink' : 'gray'
    }

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
    console.log(node.leaves())
    const tile = arvore.append('rect')
                       .attr('class', 'tile')
                       .attr('data-name', d => d.data.name)
                       .attr('data-category', d => d.data.category)
                       .attr('data-value', d => d.data.value)
                       .attr('width', d => d.x1 - d.x0)
                       .attr('height', d => d.y1 - d.y0)
                       .style('fill', d => color(d.data.category))
})