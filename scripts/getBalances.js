const main = async () => {
    const accounts = await ethers.getSigners();
    for (const account of accounts) {
        const balance = await account.getBalance();
        console.log(balance);
    }
}

main();