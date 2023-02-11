import React, { useEffect } from 'react';
import ReactDOM from "react-dom";

import ReactTooltip from 'react-tooltip';

import './App.scss';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import NodeMap from './components/node-map';
import useStore from './store';
import { pick } from 'lodash';
import { NodeLevel } from './shared/types';
import { ProgressBar } from './shared/components/progress-bar';
import { NODE_STRENGTH } from './store/nodes';

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
  const nodes = useStore(s => pick(s.nodes, ['nodes', 'update', 'nodeProgress']))
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();
      
      nodes.update(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [nodes.update]);

  return <div className="content">
    <NodeMap nodes={nodes.nodes[NodeLevel.Internet]} />
    {nodes.nodeProgress ? 
        <ProgressBar progress={nodes.nodeProgress.minedAmount / NODE_STRENGTH} color="white" noBorder />
    : null}
  </div>;
}

export default App;
