import {shallow} from 'zustand/shallow';
import React, { useEffect } from 'react';
import ReactDOM from "react-dom";

import ReactTooltip from 'react-tooltip';

import './App.scss';
import NodeMap from './components/node-map/node-map';
import useStore from './store';
import { pick } from 'lodash';
import CountdownTimer from './components/countdown';
import Queue from './components/queue';
import styled from 'styled-components';
import Skills from './components/skills';
import Programs from './components/programs';

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

let requestId = requestAnimationFrame(loop);
let lastTime: number = 0;
function loop(timeStamp: number) {
  const elapsed = timeStamp - lastTime;
  lastTime = timeStamp;
  
  const state = useStore.getState();
  state.actions.update(elapsed);
  if (state.stats.protection <= 0) {
    state.nodes.reset();
    state.stats.reset();
    state.actions.reset();
  }

  requestId = requestAnimationFrame(loop);
}


function Content() {
  return <div className="content">
    <CountdownTimer />
    <SideBySidePanels>
      <SidePanel>
        <Skills />
        <Programs />
      </SidePanel>
      <CenterPanel>
        <NodeMap />
      </CenterPanel>
      <SidePanel>
        <Queue />
      </SidePanel>
    </SideBySidePanels>
  </div>;
}

const SideBySidePanels = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
`;

const SidePanel = styled.div`
  width: 260px;
`;

const CenterPanel = styled.div`
  width: 100%;
  height: 100%;
`;

export default App;
