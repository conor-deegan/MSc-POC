// contracts/INode.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface INode {
    function enter(string memory _nodeId, string memory _agentId) external;

    function exit(string memory _nodeId, string memory _agentId) external;

    function progress(string memory _nodeId, string memory _agentId) external;

    function getLength(string memory _nodeId) external returns (uint256);

    function getStatus(string memory _nodeId) external returns (bool);
}
