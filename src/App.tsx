import {
  MetaProvider,
} from "@solidjs/meta";
import {
  Component,
  ParentComponent,
} from "solid-js";
import { createStore } from "solid-js/store";

import _Head from "./_Head";
import styles from "./App.module.styl";

import NodesBoard from "@/component/NodesBoard";
import { Node } from "@/type/domain/Node";
import { Size } from "@/type/domain/Size";

const Providers: ParentComponent = (props) => (
  <MetaProvider>
    {props.children}
  </MetaProvider>
);

const App: Component = () => {
  const [nodes, setNodes] = createStore<Node[]>([]);

  return (
    <Providers>
      <_Head />
      <header class={styles.Header}>
        <h1>Title</h1>
      </header>
      <main class={styles.Main}>
        <NodesBoard props={{
          nodes: nodes,
          setNodes: setNodes,
          baseCellSize: Size.from(32),
          scaleRatioOnWheel: 1.25,
        }} />
      </main>
    </Providers>
  );
};

export default App;
