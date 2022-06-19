import Graph from 'react-graph-vis';
import { v4 as uuidv4 } from 'uuid';

const GraphComp = ({ graph }: { graph: any }) => {
  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '500px',
  };

  return <Graph key={uuidv4()} graph={graph} options={options} />;
};

export default GraphComp;
