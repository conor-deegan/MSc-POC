import { useEffect, useState } from 'react';
import { useContract, useProvider } from 'wagmi';
import contractAddresses from './../../contractAddresses.json';
import agentABI from './../../artifacts/contracts/AgentContract.sol/AgentContract.json';

const AgentInfo = () => {
  const [agents, setAgents] = useState<
    {
      id: any;
      activePlan: any;
      counter: any;
      currentLocation: any;
      goalLocation: any;
      plan: any;
    }[]
  >([]);

  const provider = useProvider();
  const agentContractReadOnly = useContract({
    addressOrName: contractAddresses.agentContract,
    contractInterface: agentABI.abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    const agentInfo = async () => {
      const agentIds = await agentContractReadOnly.getAll();
      const agents = [];
      for (const agentId of agentIds) {
        const agent = await agentContractReadOnly.get(agentId);
        agents.push({
          id: agent.id,
          activePlan: agent.activePlan,
          counter: agent.counter.toString(),
          currentLocation: agent.currentLocation,
          goalLocation: agent.goalLocation,
          plan: agent.plan,
          goalLocationStatus: agent.goalLocationStatus,
          time: agent.totalEpochs.toNumber()
        });
      }
      setAgents(agents);
    };
    agentInfo();

    const interval = setInterval(() => {
      agentInfo();
    }, 1000);

    return () => clearInterval(interval);
  }, [agentContractReadOnly]);

  return (
    <ul>
      {agents &&
        agents.map((agent: any) => {
          return (
            <li key={agent.id}>
              <p>-------------</p>
              <p>Agent: {agent.id}</p>
              <p>Current Location: {agent.currentLocation}</p>
              <p>Active Plan: {agent.activePlan ? 'true' : 'false'}</p>
              <p>Goal Location: {agent.goalLocation}</p>
              <p>Goal Location Status: {agent.goalLocationStatus ? 'true' : 'false'}</p>
              <p>
                Route:{' '}
                {agent.plan.map((step: string) => (
                  <span key={step}>{step} </span>
                ))}
              </p>
              <p>Counter: {agent.counter}</p>
              <p>Time: {agent.time}</p>
              <p>-------------</p>
            </li>
          );
        })}
    </ul>
  );
};

export default AgentInfo;
