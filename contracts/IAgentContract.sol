// contracts/'IAgentContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAgentContract {
    function planHook(string memory _agentId, string[] memory _plan) external;

    function abortPlan(string memory _agentId) external;

    function planCompleted(string memory _agentId) external;
}
