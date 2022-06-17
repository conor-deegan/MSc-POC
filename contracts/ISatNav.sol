// contracts/'ISatNav.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISatNav {
    function addNode(
        string memory _nodeId,
        address _nodeAddress,
        string[] memory _adjacents
    ) external;

    function shortestPathRequest(
        string memory _agentId,
        string memory _source,
        string memory _target
    ) external;

    function setAgentAddress(address _agentAddress) external;
}
