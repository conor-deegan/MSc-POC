import { useEffect, useState } from 'react';
import { useContract, useProvider } from 'wagmi';
import Graph from 'react-graph-vis';
import { v4 as uuidv4 } from 'uuid';
import contractAddresses from './../../contractAddresses.json';
import satNavABI from './../../artifacts/contracts/SatNav.sol/SatNav.json';

const GraphComp = () => {
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

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '800px',
  };

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
    <>{loaded && <Graph key={uuidv4()} graph={graph} options={options} />}</>
  );
};

export default GraphComp;
