require("@nomiclabs/hardhat-waffle");

module.exports = {
    networks: {
        development: {
            url: 'http://127.0.0.1:8545'
        }
    },
    solidity: '0.8.4'
};