// contracts/RoadContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ISatNav.sol";

contract RoadContract {
    // state
    address satNavAddress;
    struct Road {
        string id;
        uint256 length;
        string[] adjacents;
        string[] inhabitants;
    }
    mapping(string => Road) roads;

    constructor(address _satNavAddress) {
        satNavAddress = _satNavAddress;
    }

    // function used to add a road to the network
    function add(
        string memory _roadId,
        uint256 _length,
        string[] memory _adjacents
    ) public {
        Road memory newRoad = Road({
            id: _roadId,
            length: _length,
            adjacents: _adjacents,
            inhabitants: new string[](0)
        });
        roads[_roadId] = newRoad;
        ISatNav(satNavAddress).addNode(_roadId, address(this), _adjacents);
    }

    // function used to get a road
    function get(string memory _roadId) public view returns (Road memory) {
        return roads[_roadId];
    }
}
