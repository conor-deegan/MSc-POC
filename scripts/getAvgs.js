// Get the average time taken to complete their goal
const fs = require('fs');

const main = async () => {
    // Get contract addresses
    let addresses = JSON.parse(fs.readFileSync('contractAddresses.json'));

    // create an instance of the agent contract
    const agentContract = await (await ethers.getContractFactory('AgentContract')).attach(addresses.agentContract);

    const agentIds = await agentContract.getAll();

    count = 0;
    sum = 0;
    for (const agentId of agentIds) {
        const agent = await agentContract.get(agentId);
        sum += agent.totalEpochs.toNumber();
        count += 1;
    }
    console.log('--- AVG EPOCHS ---');
    console.log(sum / count);
    console.log('------------------');
}

main();