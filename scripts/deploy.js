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

    // set up oracle listener
    satNav.on("NewShortestPathJob", async (agentId, source, target) => {
        const shortestPath = await getShortestPath(satNav, source, target, agentId);
        console.log(shortestPath);
        await satNav.shortestPathResponse(shortestPath.agentId, shortestPath.path);
    });

    // set up network structure
    await roadContract.add('road1', 10, []);
    await roadContract.add('road2', 10, []);
    await junctionContract.add('junction1', 5, ['road1', 'road2']);
    await roadContract.add('road3', 10, ['road2']);
    await roadContract.add('road4', 10, ['road3']);
    await roadContract.add('road5', 10, ['road4', 'road1']);
    await buildingContract.add('building1', ['road1']);
}

main();