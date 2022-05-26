const Agent = {
    agents: new Map(),
    createAgent: function (id, name, currentLocation) {
        // a mapping from id to struct in solidity
        this.agents.set(id, {
            id: id,
            name: name,
            currentLocationBelief: currentLocation
        });
    },
    getAgents: function () {
        return this.agents
    },
    getAgent: function (id) {
        return this.agents.get(id);
    },
    addGoal: function (agentId, goTo) {
        this.agents.get(agentId).goal = goTo;
        this.createPlan(agentId);
        return true;
    },
    createPlan: function (agentId) {
        const path = SatNav.shortestPath(this.agents.get(agentId).currentLocationBelief, this.agents.get(agentId).goal);
        this.agents.get(agentId).plan = path;
    },
    // Agent is given goal to go to road 3
    // It currently believes it is in the bank
    // It creates a plan to acheive that goal based on it's beliefs - it requests information from the SatNav service to populate these beliefs. The agent is dumb (as is the satnav) as to how long each step in the plan will take
    // It now must execute each step of the plan
    tick: function () {
        this.agents.forEach(agent => {
            if (agent.goal) {
                if (agent.plan.path[0] !== agent.currentLocationBelief) {
                    console.log('Or I may just need to enter it?');
                    console.log('Hmm, I am not where I should be');
                }
                console.log('Need some way for the first action to be popped, and actioned but it might take N ticks to complete the action, need a way to store that and wait?');
                console.log(agent.plan.path);
            }
        });
    }

};

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

            let path = stack.reverse();

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
    // enter and exit standards? and then logic of what happens between entering and exiting is custom to the node type
    // length of road N means N ticks after ntering before leaving
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
    // enter and exit standards? and then logic of what happens between entering and exiting is custom to the node type
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
    // enter and exit standards? and then logic of what happens between entering and exiting is custom to the node type
    // queues
    // red lights
}

const agentId = 'agent1';
Agent.createAgent(agentId, 'Conor', 'bank');

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

// the source here is filled in by the agents current position
// the agent knows it does not need to enter the first thing on the list as it is already there
Agent.addGoal(agentId, '3');

Agent.tick();

// Re the visualiation - a graph visualising, updates each tick, shows the graph (agent on graph?)
// Shows the agent current information in text
// shows the path the agent has been told to take