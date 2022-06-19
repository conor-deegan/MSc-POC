import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useContract, useProvider, useSigner, useAccount } from 'wagmi';
import contractAddresses from './../../contractAddresses.json';
import satNavABI from './../../artifacts/contracts/SatNav.sol/SatNav.json';

const Graph = dynamic(() => import('./../components/Graph'), {
  ssr: false,
});

const Home: NextPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [graph, setGraph] = useState<{
    nodes: { id: any; label: any }[];
    edges: { from: any; to: string }[];
  }>();

  const provider = useProvider();
  const satNavContractReadOnly = useContract({
    addressOrName: contractAddresses.satNav,
    contractInterface: satNavABI.abi,
    signerOrProvider: provider,
  });
  const signer = useSigner();
  const satNavContractWriteOnly = useContract({
    addressOrName: contractAddresses.satNav,
    contractInterface: satNavABI.abi,
    signerOrProvider: signer.data,
  });

  useEffect(() => {
    const graphInfo = async () => {
      const nodes = await satNavContractReadOnly.getNodes();
      const formattedNodes = [];
      const formattedEdges: { from: any; to: string }[] = [];
      for (const node of nodes) {
        const adjList = await satNavContractReadOnly.getAdjacencyList(node);
        formattedNodes.push({
          id: node,
          label: node,
        });
        adjList.forEach((t: string) => {
          formattedEdges.push({
            from: node,
            to: t,
          });
        });
      }
      const graph = {
        nodes: formattedNodes,
        edges: formattedEdges,
      };
      setGraph(graph);
      setLoaded(true);
    };
    graphInfo();
  }, [satNavContractReadOnly]);

  return (
    <div>
      <main>
        <ConnectButton />
        {loaded && <Graph graph={graph} />}
        <div>
          <p>Agent: agent-1</p>
          <p>Current location: building-1</p>
          <p>Current goal: road-3</p>
          <p>Plan: building-1, road-2, road-3</p>
          <p>-------------</p>
        </div>
        <div>
          <p>Agent: agent-1</p>
          <p>Current location: building-1</p>
          <p>Current goal: road-3</p>
          <p>Plan: building-1, road-2, road-3</p>
          <p>-------------</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
