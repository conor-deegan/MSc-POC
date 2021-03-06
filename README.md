# MSc Dissertation - The use of Blockchain technology to achieve web scale agent-based simulations

## Conor Deegan

### Setup

1. Compile the smart contracts and run a local ethereum node
```
npm run setup
```

2. In a seperate terminal, deploy the simulation to the ethereum network
```
npm run deploy
```

3. In a seperate terminal, optionally run a client on port 3000 for visualisation of the sim
```
npm run client
```

4. In a seperate terminal, run the junction controller - this is an oracle which controls the traffic light system
```
npm run junction:controller
```

### Running Simulations

Once setup, there are 3 different sims that can be run. 

1. A simulation consisting of one agent navigating through the network

```
npm run agent-sim:single
```

2. A simulation consisting of 10 agents navigating through the network at the same time

```
npm run agent-sim:multiple
```

3. A simulation consisting of 10 agents navigating through the network doing so in staggered times

```
npm run agent-sim:staggered
```