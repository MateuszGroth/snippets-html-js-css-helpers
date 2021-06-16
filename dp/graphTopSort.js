// graph top sort takes graph array where g[i] = [...edges] are outbound edges for ith node
// [[3], [3], [0,1], [6,7], [0,3,5], [9,10], [8], [8,9], [11], [11, 12], [9], [], []]
// should return [12, 11, 9, 8, 7, 6, 3, 0, 10, 5, 4, 1, 2]
// eg graph = [[2,3], [3,4,5], ]

// for top sort you have to use dfs
// it makes it so ou are able to see which element the tree ends on and you can put it at the end of an array
// (or beginning and reverse)

// with placing elements on the end of an array
var topSort = graph => {
    let n = graph.length;
    let vis = [...Array(n)].map(() => false);

    let id = n - 1;
    let ordered = [...Array(n)];
    for (let i = 0; i < n; i++) {
        if (vis[i]) continue;
        id = dfs(i, id, ordered, graph, vis);
    }

    return ordered;
};

var dfs = (at, id, ordered, graph, vis) => {
    vis[at] = true;
    for (let i = 0; i < graph[at].length; i++) {
        if (vis[graph[at][i]]) continue;
        id = dfs(graph[at][i], id, ordered, graph, vis);
    }

    ordered[id] = at;

    return id - 1;
};

// with pushing elements to an array and reversing at the end
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
