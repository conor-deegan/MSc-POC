// contracts/AgentContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ISatNav.sol";

contract AgentContract {
    // state
    address satNavAddress;
    struct Agent {
        string id;
        string currentLocation;
        string goalLocation;
    }
    mapping(string => Agent) agents;

    constructor(address _satNavAddress) {
        satNavAddress = _satNavAddress;
        ISatNav(_satNavAddress).setAgentAddress(address(this));
    }

    // function used to create an agent
    function create(string memory _agentId, string memory _currentLocation)
        public
    {
        Agent memory newAgent = Agent({
            id: _agentId,
            currentLocation: _currentLocation,
            goalLocation: ""
        });
        agents[_agentId] = newAgent;
    }

    // function used to get an agent
    function get(string memory _agentId) public view returns (Agent memory) {
        return agents[_agentId];
    }

    // function used to give a goal location to an agent
    function addGoal(string memory _agentId, string memory _goalLocation)
        public
    {
        Agent storage agent = agents[_agentId];
        agent.goalLocation = _goalLocation;
        creatPlan(agent);
    }

    // function used to create a plan for an agent
    function creatPlan(Agent memory _agent) private {
        ISatNav(satNavAddress).shortestPathRequest(
            _agent.id,
            _agent.currentLocation,
            _agent.goalLocation
        );
    }

    // function used to receive the plan
    function planHook(string memory _agentId, string[] memory _plan)
        public
        view
    {
        console.log(_agentId);
        for (uint256 i = 0; i < _plan.length; i++) {
            console.log(_plan[i]);
        }
    }
}
