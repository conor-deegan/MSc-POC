const fs = require('fs');

const main = async () => {
    // Get contract addresses
    let addresses = JSON.parse(fs.readFileSync('contractAddresses.json'));

    // create an instance of the agent contract
    const agentContract = await (await ethers.getContractFactory('AgentContract')).attach(addresses.agentContract);

    // create an agent
    await agentContract.create('agent1', 'building1');

    // give the agent a goal
    await agentContract.addGoal('agent1', 'building2');

    // set up epochs
    const epoch = async () => {
        // get all agent ids
        const agentIds = await agentContract.getAll();
        // loop over each agentId
        for (const agentId of agentIds) {
            await agentContract.epoch(agentId);
        }
        // wait N milliseconds and then recusively call epoch
        const N = 2000;
        await new Promise(resolve => setTimeout(resolve, N));
        epoch();
    }
    epoch();
}

main();