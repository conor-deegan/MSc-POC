// BFS of graph

const getShortestPath = async (contract, source, target, agentId) => {
    const queue = [];
    queue.push(source);
    const discovered = [];
    discovered[source] = true;
    const edges = [];
    edges[source] = 0;
    const predecessors = [];
    predecessors[source] = null;
    const buildPath = (target, source, predecessors) => {
        const stack = [];
        stack.push(target);
        let u = predecessors[target];
        while (u != source) {
            stack.push(u);
            u = predecessors[u];
        }
        stack.push(source);
        let path = stack.reverse();
        return path;
    }
    while (queue.length) {
        let v = queue.shift();
        if (v === target) {
            return {
                distance: edges[target],
                path: buildPath(target, source, predecessors),
                agentId: agentId
            };
        }
        adjList = await contract.getAdjacencyList(v);
        for (let i = 0; i < adjList.length; i++) {
            if (!discovered[adjList[i]]) {
                discovered[adjList[i]] = true;
                queue.push(adjList[i]);
                edges[adjList[i]] = edges[v] + 1;
                predecessors[adjList[i]] = v;
            }
        }
    }
    return false;
}

module.exports = getShortestPath;