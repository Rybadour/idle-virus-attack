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

function Content() {
  const actions = useStore(s => pick(s.actions, ['update']), shallow)

  useEffect(() => {
    let requestId = requestAnimationFrame(loop);
    let lastTime: number = Date.now();
    function loop(timeStamp: number) {
      const elapsed = timeStamp - lastTime;
      lastTime = timeStamp;
      
      actions.update(elapsed);
      requestId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(requestId);
  }, [actions.update]);

  return <div className="content">
    <CountdownTimer />
    <SideBySidePanels>
      <SidePanel>
        <Skills />
        <Consumables />
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
