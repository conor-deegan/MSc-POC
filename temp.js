const SatNav = {
    nodes: [],
    adjacencyList: {},
    addNode: function (id, adjacents) {
        this.nodes.push(id);
        this.adjacencyList[id] = [];
        adjacents.forEach(adjacent => {
            this.adjacencyList[id].push(adjacent);
            this.adjacencyList[adjacent].push(id);
        })
    },
    getNodes: function () {
        return this.nodes;
    },
    getAdjacencyList: function () {
        return this.adjacencyList
    },
    shortestPath(source, target) {
        let adj = this.adjacencyList;

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

            let path = stack.reverse().join('-');

            return path;
        }


        while (queue.length) {
            let v = queue.shift();

            if (v === target) {
                return {
                    distance: edges[target],
                    path: buildPath(target, source, predecessors)
                };
            }

            for (let i = 0; i < adj[v].length; i++) {
                if (!discovered[adj[v][i]]) {
                    discovered[adj[v][i]] = true;
                    queue.push(adj[v][i]);
                    edges[adj[v][i]] = edges[v] + 1;
                    predecessors[adj[v][i]] = v;
                }
            }
        }

        return false;
    }
}

// Note id and name are common to all environment nodes and should be in the parent contract
const Road = {
    roads: new Map(),
    addRoad: function (id, name, length, adjacents) {
        // a mapping from id to struct in solidity
        this.roads.set(id, {
            id: id,
            name: name,
            length: length,
            adjacents: adjacents
        });
        SatNav.addNode(id, adjacents);
    },
    getRoads: function () {
        return this.roads;
    },
    getRoad: function (id) {
        return this.roads.get(id);
    },
    getRoadLength: function (id) {
        return this.roads.get(id).length;
    }
    // enter and exit standards? Maybe need different terms
    // thi will have more road specific things like move down etc
    // I wonder if the length of the road is N could I make it take N ticks before it can exit??
}

const Building = {
    buildings: new Map(),
    addBuilding: function (id, name, road) {
        // a mapping from id to struct in solidity
        this.buildings.set(id, {
            id: id,
            name: name,
            adjacents: [road]
        });
        SatNav.addNode(id, [road]);
    }
    // enter and exit standards? Maybe need different terms
}


const Junction = {
    junctions: new Map(),
    addJunction: function (id, name, adjacents) {
        // a mapping from id to struct in solidity
        this.junctions.set(id, {
            id: id,
            name: name,
            adjacents: adjacents
        });
        SatNav.addNode(id, adjacents);
    }
    // enter and exit standards? Maybe need different terms
    // queue
    // turning right etc?
}

const m1Id = '1';
Road.addRoad(m1Id, 'm1', 50, []);
const m2Id = '2';
Road.addRoad(m2Id, 'm2', 100, []);
const junction1 = 'junction1';
Junction.addJunction(junction1, 'Red Cow', [m1Id, m2Id]);
const m3Id = '3';
Road.addRoad(m3Id, 'm3', 75, [m2Id]);
const m4Id = '4';
Road.addRoad(m4Id, 'm4', 50, [m3Id]);
const m5Id = '5';
Road.addRoad(m5Id, 'm5', 50, [m4Id, m1Id]);
const building1 = 'bank';
Building.addBuilding(building1, 'AIB', m1Id);

// console.log(Road.getRoads());
// console.log(SatNav.getAdjacencyList());
console.log(SatNav.getNodes());
// the source here is filled in by the agents current position
console.log(SatNav.shortestPath('bank', '3'));