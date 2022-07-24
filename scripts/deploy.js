const fs = require('fs');
const getShortestPath = require('./shortestPath');

async function main() {

    // deploy contracts
    const satNav = await (await (await ethers.getContractFactory('SatNav')).deploy()).deployed();

    const agentContract = await (await (await ethers.getContractFactory('AgentContract')).deploy(satNav.address)).deployed();

    const roadContract = await (await (await ethers.getContractFactory('RoadContract')).deploy(satNav.address)).deployed();

    const buildingContract = await (await (await ethers.getContractFactory('BuildingContract')).deploy(satNav.address)).deployed();

    const junctionContract = await (await (await ethers.getContractFactory('JunctionContract')).deploy(satNav.address)).deployed();

    console.log('\nSatNav contract deployed to:', satNav.address);
    console.log('\nAgent contract deployed to:', agentContract.address);
    console.log('\nRoad contract deployed to:', roadContract.address);
    console.log('\nBuilding contract deployed to:', buildingContract.address);
    console.log('\nJunction contract deployed to:', junctionContract.address);

    const contractAddresses = {
        satNav: satNav.address,
        agentContract: agentContract.address,
        roadContract: roadContract.address,
        buildingContract: buildingContract.address,
        junctionContract: junctionContract.address
    };
    fs.writeFileSync('contractAddresses.json', JSON.stringify(contractAddresses, null, 4));
    fs.appendFileSync('logs.txt', "\n-------- NEW RUN --------\n");

    // set up oracle listener
    satNav.on("NewShortestPathJob", async (agentId, source, target) => {
        const shortestPath = await getShortestPath(satNav, source, target, agentId);
        await satNav.shortestPathResponse(shortestPath.agentId, shortestPath.path);
        const data = `CONTRACT: SATNAV, NEW SHORTEST PATH, AGENT ID: ${agentId}, PATH: ${shortestPath.path}\n`
        fs.appendFileSync('logs.txt', data);
    });

    // set up event listners for logging
    agentContract.on("Log", (agentId, log) => {
        const data = `CONTRACT: AGENT, AGENT ID: ${agentId}, MESSAGE: ${log}\n`
        fs.appendFileSync('logs.txt', data);
    });
    agentContract.on("TotalEpochs", (agentId, log) => {
        const data = `CONTRACT: AGENT, AGENT ID: ${agentId}, PLAN COMPLETED IN : ${log} EPOCHS\n`
        fs.appendFileSync('logs.txt', data);
    });
    roadContract.on("Log", (nodeId, agentId, log) => {
        const data = `CONTRACT: ROAD, NODE ID: ${nodeId}, AGENT ID: ${agentId}, MESSAGE: ${log}\n`
        fs.appendFileSync('logs.txt', data);
    });
    buildingContract.on("Log", (nodeId, agentId, log) => {
        const data = `CONTRACT: BUILDING, NODE ID: ${nodeId}, AGENT ID: ${agentId}, MESSAGE: ${log}\n`
        fs.appendFileSync('logs.txt', data);
    });
    junctionContract.on("Log", (nodeId, agentId, log) => {
        const data = `CONTRACT: JUNCTION, NODE ID: ${nodeId}, AGENT ID: ${agentId}, MESSAGE: ${log}\n`
        fs.appendFileSync('logs.txt', data);
    });

    // set up network structure

    // Roads
    await roadContract.add('road1', 5, []);
    await roadContract.add('road2', 5, []);
    await roadContract.add('road3', 5, []);
    await roadContract.add('road4', 5, []);
    await roadContract.add('road5', 5, []);
    await roadContract.add('road6', 5, []);

    // Junctions
    await junctionContract.add('junction1', ['road1', 'road2'], true);
    await junctionContract.add('junction2', ['road2', 'road4'], false);
    await junctionContract.add('junction3', ['road4', 'road5'], true);
    await junctionContract.add('junction4', ['road4', 'road6'], true);
    await junctionContract.add('junction5', ['road5', 'road2'], false);
    await junctionContract.add('junction6', ['road6', 'road3'], true);
    await junctionContract.add('junction7', ['road3', 'road5'], false);

    // Buuldings
    await buildingContract.add('building1', ['road1']);
    await buildingContract.add('building2', ['road3']);
    await buildingContract.add('building3', ['road5']);
}

main();