// contracts/JunctionContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ISatNav.sol";

contract JunctionContract {
    // state
    address satNavAddress;
    struct Junction {
        string id;
        string[] adjacents;
    }
    mapping(string => Junction) junctions;

    constructor(address _satNavAddress) {
        satNavAddress = _satNavAddress;
    }

    // function used to add a junction to the network
    function add(string memory _junctionId, string[] memory _adjacents) public {
        Junction memory newJunction = Junction({
            id: _junctionId,
            adjacents: _adjacents
        });
        junctions[_junctionId] = newJunction;
        ISatNav(satNavAddress).addNode(_junctionId, address(this), _adjacents);
    }

    // function used to get a junction
    function get(string memory _junctionId)
        public
        view
        returns (Junction memory)
    {
        return junctions[_junctionId];
    }
}
