// dijkstra finds shortest path within dag with non negative weights;
// it uses a list with key, value pairs, where key is current node id and value is dist to it
// everytime you just process the element with the lowest dist
var dijkstra = (start, graph) => {
    let n = graph.length;
    let vis = [...Array(n)].map(() => false);
    let dist = [...Array(n)].map(() => null);
    dist[start] = 0;
    let dijkstraArray = [[start, 0]];

    while (dijkstraArray.length) {
        let indexOfLowestDist = -1;
        let tmpVal = null;
        dijkstraArray.forEach(([key, val], i) =>
            tmpVal == null || tmpVal > val ? ((tmpVal = val), (indexOfLowestDist = i)) : null
        );
        let [node, d] = dijkstraArray.splice(indexOfLowestDist, 1);

        // lowest dist has been taken from array, so mark this node as visited
        // in case it is present in any of the future edges
        // (if it was checked, it was checked with the shortest dist - no need to check it anymore)
        // (no need to push it into queue)
        vis[node] = true;
        for (let i = 0; i < graph[node].length; i++) {
            if (vis[graph[node][i]]) continue;
            let newDist = d + graph[node][i].weight; // new dist to that children edge
            // could be newDist = dist[node] + graph[node][i].weight;
            if (dist[graph[node][i]] == null || newDist < dist[graph[node][i]]) {
                dijkstraArray.push([graph[node][i], newDist]);
                dist[graph[node][i]] = newDist;
            }
        }
    }

    return dist;
};
