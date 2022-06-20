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
        uint256 queueLength;
        string[] adjacents;
        string[] inhabitants;
    }
    mapping(string => Junction) junctions;
    mapping(string => mapping(string => bool)) inhabitants;
    mapping(string => uint256) inhabitantCounter;
    mapping(string => mapping(string => uint256)) inhabitantPosition;

    // logging event structure
    event Log(string nodeId, string agentId, string log);

    constructor(address _satNavAddress) {
        satNavAddress = _satNavAddress;
    }

    // function used to add a junction to the network
    function add(
        string memory _junctionId,
        uint256 _queueLength,
        string[] memory _adjacents
    ) public {
        Junction memory newJunction = Junction({
            id: _junctionId,
            queueLength: _queueLength,
            adjacents: _adjacents,
            inhabitants: new string[](0)
        });
        junctions[_junctionId] = newJunction;
        ISatNav(satNavAddress).addNode(
            _junctionId,
            address(this),
            _adjacents,
            "junction"
        );
    }

    // function used to get a junction
    function get(string memory _junctionId)
        public
        view
        returns (Junction memory)
    {
        return junctions[_junctionId];
    }

    // function used to get a junctions queue length
    function getLength(string memory _junctionId)
        public
        view
        returns (uint256)
    {
        return junctions[_junctionId].queueLength;
    }

    // function used to enter a junction
    function enter(string memory _junctionId, string memory _agentId) public {
        inhabitants[_junctionId][_agentId] = true;
        inhabitantPosition[_junctionId][_agentId] = 0;
        inhabitantCounter[_junctionId]++;
        emit Log(_junctionId, _agentId, "Entered Junction");
    }

    // function used to exit a junction
    function exit(string memory _junctionId, string memory _agentId) public {
        inhabitants[_junctionId][_agentId] = false;
        inhabitantPosition[_junctionId][_agentId] = 0;
        inhabitantCounter[_junctionId]--;
        emit Log(_junctionId, _agentId, "Exited Junction");
    }

    // function used to move up the queue in the junction
    function progress(string memory _junctionId, string memory _agentId)
        public
    {
        inhabitantPosition[_junctionId][_agentId]++;
        emit Log(_junctionId, _agentId, "Moved Up Junction Queue");
    }
}
