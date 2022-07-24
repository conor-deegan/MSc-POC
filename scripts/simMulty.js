const fs = require('fs');
const NUM_AGENTS = 6;

const main = async (numAgents) => {
    // Get contract addresses
    let addresses = JSON.parse(fs.readFileSync('contractAddresses.json'));

    // create an instance of the agent contract
    const agentContract = await (await ethers.getContractFactory('AgentContract')).attach(addresses.agentContract);

    // create an instance of the building contract
    const buildingContract = await (await ethers.getContractFactory('BuildingContract')).attach(addresses.buildingContract);

    for (let i = 0; i < numAgents; i++) {
        const agentId = `agent${i+1}`
        const numBuildings = (await buildingContract.numBuildings()).toNumber()
        const startBuilding = Math.floor(Math.random() * numBuildings) + 1;
        let goalBuilding = Math.floor(Math.random() * numBuildings) + 1;
        while (goalBuilding === startBuilding) {
            goalBuilding = Math.floor(Math.random() * numBuildings) + 1;
        }
        // create an agent
        await agentContract.create(agentId, `building${startBuilding}`);

        // give the agent a goal
        await agentContract.addGoal(agentId, `building${goalBuilding}`);
    }

    // set up epochs
    const epoch = async () => {
        // get all agent ids
        const agentIds = await agentContract.getAll();
        // loop over each agentId
        for (const agentId of agentIds) {
            await agentContract.epoch(agentId);
        }
        // wait N milliseconds and then recusively call epoch
        const N = 750;
        await new Promise(resolve => setTimeout(resolve, N));
        epoch();
    }
    epoch();
}

main(NUM_AGENTS);