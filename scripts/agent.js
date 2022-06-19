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
}

main();