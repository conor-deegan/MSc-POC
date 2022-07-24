// Traffic light Oracle
const fs = require('fs');

const junctionController = async () => {
    // Get contract addresses
    let addresses = JSON.parse(fs.readFileSync('contractAddresses.json'));

    // create an instance of the junction contract
    const junctionContract = await (await ethers.getContractFactory('JunctionContract')).attach(addresses.junctionContract);

    // set up epochs
    const epoch = async () => {
        // get all junction ids
        const junctionIds = await junctionContract.getAll();
        // loop over each junctionId
        for (const junctionId of junctionIds) {
            const junction = await junctionContract.get(junctionId);
            await junctionContract.setGreenLight(junctionId, !junction.greenLight);
        }
        // wait N milliseconds and then recusively call epoch
        const N = 3000;
        await new Promise(resolve => setTimeout(resolve, N));
        epoch();
    }
    epoch();
}

junctionController();