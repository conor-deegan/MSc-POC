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
    mapping(string => mapping(string => bool)) inhabitants;
    mapping(string => uint256) inhabitantCounter;
    mapping(string => mapping(string => uint256)) inhabitantPosition;

    // logging event structure
    event Log(string nodeId, string agentId, string log);

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
        ISatNav(satNavAddress).addNode(
            _roadId,
            address(this),
            _adjacents,
            "road"
        );
    }

    // function used to get a road
    function get(string memory _roadId) public view returns (Road memory) {
        return roads[_roadId];
    }

    // function used to get a roads length
    function getLength(string memory _roadId) public view returns (uint256) {
        return roads[_roadId].length;
    }

    // function used to enter a road
    function enter(string memory _roadId, string memory _agentId) public {
        inhabitants[_roadId][_agentId] = true;
        inhabitantPosition[_roadId][_agentId] = 0;
        inhabitantCounter[_roadId]++;
        emit Log(_roadId, _agentId, "Entered Road");
    }

    // function used to exit a road
    function exit(string memory _roadId, string memory _agentId) public {
        inhabitants[_roadId][_agentId] = false;
        inhabitantPosition[_roadId][_agentId] = 0;
        inhabitantCounter[_roadId]--;
        emit Log(_roadId, _agentId, "Exited Road");
    }

    // function used to progress along the road
    function progress(string memory _roadId, string memory _agentId) public {
        inhabitantPosition[_roadId][_agentId]++;
        emit Log(_roadId, _agentId, "Progressed Along Road");
    }
}
