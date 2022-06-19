const fs = require('fs');

const main = async () => {
    // Get contract addresses
    let addresses = JSON.parse(fs.readFileSync('contractAddresses.json'));

    // create an instance of the agent contract
    const agentContract = await (await ethers.getContractFactory('AgentContract')).attach(addresses.agentContract);

    // set up epochs
    const epoch = async () => {
        // get all agent ids
        const agentIds = await agentContract.getAll();
        // loop over each agentId
        for (const agentId of agentIds) {
            await agentContract.epoch(agentId);
        }
        // wait 1 second and then recusively call epoch
        await new Promise(resolve => setTimeout(resolve, 3000));
        epoch();
    }
    epoch();
}

main();