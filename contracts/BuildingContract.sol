// contracts/BuildingContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ISatNav.sol";

contract BuildingContract {
    // state
    address satNavAddress;
    struct Building {
        string id;
        string[] adjacents;
    }
    mapping(string => Building) buildings;
    mapping(string => mapping(string => bool)) inhabitants;
    mapping(string => uint256) inhabitantCounter;
    uint256 public numBuildings = 0;

    // logging event structure
    event Log(string nodeId, string agentId, string log);

    constructor(address _satNavAddress) {
        satNavAddress = _satNavAddress;
    }

    // function used to add a building to the network
    function add(string memory _buildingId, string[] memory _adjacents) public {
        Building memory newBuilding = Building({
            id: _buildingId,
            adjacents: _adjacents
        });
        buildings[_buildingId] = newBuilding;
        numBuildings++;
        ISatNav(satNavAddress).addNode(
            _buildingId,
            address(this),
            _adjacents,
            "building"
        );
    }

    // function used to get a building
    function get(string memory _buildingId)
        public
        view
        returns (Building memory)
    {
        return buildings[_buildingId];
    }

    // function used to enter a building
    function enter(string memory _buildingId, string memory _agentId) public {
        inhabitants[_buildingId][_agentId] = true;
        inhabitantCounter[_buildingId]++;
        emit Log(_buildingId, _agentId, "Entered Building");
    }

    // function used to exit a building
    function exit(string memory _buildingId, string memory _agentId) public {
        inhabitants[_buildingId][_agentId] = false;
        inhabitantCounter[_buildingId]--;
        emit Log(_buildingId, _agentId, "Exited Building");
    }
}
