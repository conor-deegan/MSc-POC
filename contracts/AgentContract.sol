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
        bool activePlan;
        string[] plan;
    }
    mapping(string => Agent) agents;
    string[] agentIds;

    constructor(address _satNavAddress) {
        satNavAddress = _satNavAddress;
        ISatNav(_satNavAddress).setAgentAddress(address(this));
    }

    // function used to create an agent
    function create(
        string memory _agentId,
        string memory _currentLocation
    ) public {
        Agent memory newAgent = Agent({
            id: _agentId,
            currentLocation: _currentLocation,
            goalLocation: "",
            activePlan: false,
            plan: new string[](0)
        });
        agents[_agentId] = newAgent;
        agentIds.push(_agentId);
    }

    // function used to get all agent ids
    function getAll() public view returns (string[] memory) {
        return agentIds;
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

    // function used to create a plan for an agent (private)
    function creatPlan(Agent memory _agent) private {
        ISatNav(satNavAddress).shortestPathRequest(
            _agent.id,
            _agent.currentLocation,
            _agent.goalLocation
        );
    }

    // function used to receive the plan
    function planHook(string memory _agentId, string[] memory _plan) public {
        require(msg.sender == satNavAddress, "Cannot call this function");
        Agent storage agent = agents[_agentId];
        agent.activePlan = true;
        agent.plan = _plan;
    }

    // function called on each epoch
    function epoch(string memory _agentId) public {
        Agent memory agent = agents[_agentId];
        if (!agent.activePlan) {
            return;
        } else {
            ISatNav(satNavAddress).getOptimalMove(
                _agentId,
                agent.currentLocation,
                agent.plan
            );
            return;
        }
    }

    // function called to abort the plan if there is an error
    function abortPlan(string memory _agentId) public {
        require(msg.sender == satNavAddress, "Cannot call this function");
        Agent storage agent = agents[_agentId];
        agent.activePlan = false;
        agent.plan = new string[](0);
        console.log("Aborting plan");
    }

    // function called when the plan is completed
    function planCompleted(string memory _agentId) public {
        require(msg.sender == satNavAddress, "Cannot call this function");
        Agent storage agent = agents[_agentId];
        agent.activePlan = false;
        agent.plan = new string[](0);
        console.log("Plan completed");
    }
}
