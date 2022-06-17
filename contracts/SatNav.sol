// contracts/SatNav.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IAgentContract.sol";

contract SatNav {
    // state
    mapping(string => bool) mappedNodes;
    mapping(string => address) nodeToAddress;
    string[] nodes;
    mapping(string => string[]) adjacencyList;
    address agentAddress;

    // event structure for interacting with off-chain oracle
    event NewShortestPathJob(string agentId, string source, string target);

    // function used to add a node
    function addNode(
        string memory _nodeId,
        address _nodeAddress,
        string[] memory _adjacents
    ) public {
        if (!mappedNodes[_nodeId]) {
            nodes.push(_nodeId);
            mappedNodes[_nodeId] = true;
            nodeToAddress[_nodeId] = _nodeAddress;
        }
        uint256 length = _adjacents.length;
        for (uint256 i = 0; i < length; i++) {
            string memory adjacent = _adjacents[i];
            adjacencyList[_nodeId].push(adjacent);
            adjacencyList[adjacent].push(_nodeId);
        }
    }

    // function used to set the agent contract address
    function setAgentAddress(address _agentAddress) public {
        agentAddress = _agentAddress;
    }

    // function used to get all nodes
    function getNodes() public view returns (string[] memory) {
        return nodes;
    }

    // function used to get adjacencyList for a specific node
    function getAdjacencyList(string memory _nodeId)
        public
        view
        returns (string[] memory)
    {
        return adjacencyList[_nodeId];
    }

    // function used to initiate a new shortest path computation
    function shortestPathRequest(
        string memory _agentId,
        string memory _source,
        string memory _target
    ) public {
        emit NewShortestPathJob(_agentId, _source, _target);
    }

    // function used to receive the shortest path response from the oracle
    function shortestPathResponse(string memory _agentId, string[] memory _path)
        public
    {
        IAgentContract(agentAddress).planHook(_agentId, _path);
    }

    // function for getting a node's address from the nodeId
    function getNodeAddress(string memory _nodeId)
        public
        view
        returns (address)
    {
        return nodeToAddress[_nodeId];
    }
}
