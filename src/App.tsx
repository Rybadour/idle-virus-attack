import {shallow} from 'zustand/shallow';
import React, { useEffect } from 'react';
import ReactDOM from "react-dom";

import ReactTooltip from 'react-tooltip';

import './App.scss';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import NodeMap from './components/node-map';
import useStore from './store';
import { pick } from 'lodash';
import { NodeLevel } from './shared/types';
import CountdownTimer from './components/countdown';
import Queue from './components/queue';
import styled from 'styled-components';
import Skills from './components/skills';
import Consumables from './components/consumables';

function App() {
  return (
    <div className="App">

      <Content />

      <ReactTooltip place="bottom" effect="solid" className="standard-tooltip" />

      <footer>
        <div className="attribution">
          Game icons provided by <a href="https://game-icons.net/">game-icons.net</a>
          under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
        </div>
      </footer>
    </div>
  );
}

let lastTime: number = Date.now();
function Content() {
  const nodes = useStore(s => pick(s.nodes, ['nodes', 'nodeProgress']), shallow)
  const actions = useStore(s => pick(s.actions, ['update']), shallow)
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      
      actions.update(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [actions.update]);

  return <div className="content">
    <CountdownTimer />
    <SideBySidePanels>
      <Column>
        <Skills />
        <Consumables />
      </Column>
      <NodeMap nodes={nodes.nodes[NodeLevel.Internet]} />
      <Queue />
    </SideBySidePanels>
  </div>;
}

const SideBySidePanels = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
`;

const Column = styled.div`
  width: 100%;
`;

export default App;
