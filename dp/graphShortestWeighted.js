// find path with lowest weight

// sort topoligally and then update dist array bfs

var shortestDag = (start, graph, end) => {
    let n = graph.length;

    let sortedG = topSort(graph);

    let dist = [...Array(n)].map(() => null);

    dist[start] = 0;

    for (let i = 0; i < n; i++) {
        let node = sortedG[i];

        // start might be like 5th element, so we have dist = 0 at 5th position - we can ignore previous 4
        if (dist[node] == null) continue;

        for (let m = 0; m < graph[node].length; m++) {
            // edges here
            let edge = graph[node][m];
            let newDist = dist[node] + edge.weight;
            if (dist[edge.to] == null || newDist < dist[edge.to]) dist[edge.to] = newDist;
        }
    }

    return dist[end];
};

// multiply all weights by -1
var longestDag = (start, graph, end) => {
    let n = graph.length;

    graph = graph.map(() => {}); // multiply weights by -1

    let sortedG = topSort(graph);

    let dist = [...Array(n)].map(() => null);

    dist[start] = 0;

    for (let i = 0; i < n; i++) {
        let node = sortedG[i];

        // start might be like 5th element, so we have dist = 0 at 5th position - we can ignore previous 4
        if (dist[node] == null) continue;

        for (let m = 0; m < graph[node].length; m++) {
            // edges here
            let edge = graph[node][m];
            let newDist = dist[node] + edge.weight;
            if (dist[edge.to] == null || newDist < dist[edge.to]) dist[edge.to] = newDist;
        }
    }

    return dist[end] * -1; // return weight *-1 so it is back to positive numbers
};

// for top sort you have to use dfs
// it makes it so ou are able to see which element the tree ends on and you can put it at the end of an array
// (or beginning and reverse)

var topSort = graph => {
    let n = graph.length;
    let vis = [...Array(n)].map(() => false);

    let ordered = [];
    for (let i = 0; i < n; i++) {
        if (vis[i]) continue;
        dfs(i, ordered, graph, vis);
    }

    return ordered.reverse();
};

var dfs = (at, ordered, graph, vis) => {
    vis[at] = true;
    for (let i = 0; i < graph[at].length; i++) {
        if (vis[graph[at][i]]) continue;
        dfs(graph[at][i], ordered, graph, vis);
    }

    ordered.push(at);
};
