// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Agent.sol";

contract AgentFactory {
    event AgentCreated(address indexed creator, address agentAddress);

    // Mapping to store the creator of each agent
    mapping(address => address) public agentToCreator;
    // Array to store all agents created
    address[] public agents;

    function createAgent(
        address creatorAddress,
        address initialOracleAddress,
        string memory systemPrompt,
        string memory tools,
        string memory name,
        string memory description
    ) public returns (address) {
        Agent newAgent = new Agent(
            creatorAddress,
            initialOracleAddress,
            systemPrompt,
            tools,
            name,
            description
        );
        // Store the new agent and its creator
        agentToCreator[address(newAgent)] = creatorAddress;
        agents.push(address(newAgent));

        emit AgentCreated(creatorAddress, address(newAgent));
        return address(newAgent);
    }

    // Function to get the list of all agents
    function getAgents() public view returns (address[] memory) {
        return agents;
    }

    // Function to get the creator of a specific agent
    function getCreator(address agent) public view returns (address) {
        return agentToCreator[agent];
    }
}
