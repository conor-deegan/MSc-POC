// contracts/IAgentContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAgentContract {
    function setNodeAddress(string memory _nodeId, address _nodeAddress)
        external;

    function planHook(string memory _agentId, string[] memory _plan) external;

    function optimalMoveHook(
        string memory _agentId,
        string memory _nodeId,
        string memory _identifier,
        function(string memory, string memory) external callback
    ) external;

    function abortPlan(string memory _agentId) external;

    function planCompleted(string memory _agentId) external;
}
