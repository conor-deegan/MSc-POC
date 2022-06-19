import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import AgentInfo from './../components/AgentInfo';

import styles from './../styles/Custom.module.css';

const Graph = dynamic(() => import('./../components/Graph'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <ConnectButton />
        <div className={styles.container}>
          <div className={styles.div1}>
            <Graph />
          </div>
          <div className={styles.div2}>
            <AgentInfo />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
