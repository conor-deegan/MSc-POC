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
        string[] inhabitants;
        bool greenLight;
    }
    mapping(string => Junction) junctions;
    string[] junctionIds;
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
        string[] memory _adjacents,
        bool _greenLight
    ) public {
        Junction memory newJunction = Junction({
            id: _junctionId,
            adjacents: _adjacents,
            inhabitants: new string[](0),
            greenLight: _greenLight
        });
        junctionIds.push(_junctionId);
        junctions[_junctionId] = newJunction;
        ISatNav(satNavAddress).addNode(
            _junctionId,
            address(this),
            _adjacents,
            "junction"
        );
    }

    // function used to get all junction ids
    function getAll() public view returns (string[] memory) {
        return junctionIds;
    }

    // function used to get a junction
    function get(string memory _junctionId)
        public
        view
        returns (Junction memory)
    {
        return junctions[_junctionId];
    }

    // function used to get a junctions status
    function getStatus(string memory _junctionId)
        public
        view
        returns (bool)
    {
        return junctions[_junctionId].greenLight;
    }

    // function used to set the state of the lights
    function setGreenLight(string memory _junctionId, bool _state)
        public
    {
        Junction storage junction = junctions[_junctionId];
        junction.greenLight = _state;
    }


    // function used to get a junctions queue length
    function getLength(string memory _junctionId)
        public
        view
        returns (uint256)
    {
        return inhabitantCounter[_junctionId];
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
        Junction memory junction = junctions[_junctionId];
        if(junction.greenLight) {
            inhabitants[_junctionId][_agentId] = false;
            inhabitantPosition[_junctionId][_agentId] = 0;
            inhabitantCounter[_junctionId]--;
            emit Log(_junctionId, _agentId, "Exited Junction");
        }
    }

    // function used to move up the queue in the junction
    function progress(string memory _junctionId, string memory _agentId)
        public
    {
        Junction memory junction = junctions[_junctionId];
        if(junction.greenLight) {
            inhabitantPosition[_junctionId][_agentId]++;
            emit Log(_junctionId, _agentId, "Moved Up Junction Queue");
        }
    }
}
