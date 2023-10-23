import clsx from "clsx";
import {
  Component,
  JSX,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import styles from "./index.module.styl";
import NodeMover from "../NodeMover";
import NodeScaler from "../NodeScaler";

import { Calc } from "@/function/calcObj";
import { toPartial } from "@/function/partial";
import { Camera } from "@/function/signal/createCamera";
import { Node } from "@/type/Node";
import { Size } from "@/type/Size";

const name = "NodeView";
const injectTag = "section";
type Props = {
  node: Node
  setNode: SetStoreFunction<Node>
  camera: Camera
  cellSize: Size
  // atCameraFromCell: (cell: Position) => Position
  // cellFromAtCamera: (atCamera: Position) => Position
}
const Self: ComponentFunc = (_props) => {
  const props = () => _props.props;
  const injects = () => _props.injects;

  const node = () => props().node;
  const cellSize = () => props().cellSize;
  const camera = () => props().camera;
  const setNode = () => props().setNode;

  const pos = () => {
    const atBoard = Calc["*"](node().position, Size.toPosition(cellSize()));
    const atBoardScaled = Calc["*"](atBoard, Size.toPosition(camera().scale));
    const atBoardScaledTranslated = Calc["+"](atBoardScaled, camera().translate);
    const pos = atBoardScaledTranslated;
    return pos;
  };
  const size = () => Calc["*"](node().size, cellSize());

  return (
    <section
      {...injects()}
      class={clsx(name, styles[name], injects()?.class)}
      style={{
        "--x": pos().x,
        "--y": pos().y,
        "--width": size().width,
        "--height": size().height,
        "--scale-x": `${camera().scale.width}`,
        "--scale-y": `${camera().scale.height}`,
        "--font-size": `${cellSize()}`,
      }}
    >
      <h1>{node().content}</h1>
      <NodeMover
        props={{
          camera: camera(),
          cellSize: cellSize(),
          nodePos: node().position,
          setNodePos: toPartial(setNode())("position"),
        }}
      />
      <NodeScaler
        props={{
          camera: camera(),
          cellSize: cellSize(),
          nodeSize: node().size,
          setNodeSize: toPartial(setNode())("size"),
        }}
      />
    </section>
  );
};

const self = {
  componentName: name,
  tag: injectTag,
} as const;
const This = Object.assign(Self, self);
type Injects = JSX.IntrinsicElements[typeof self.tag]
type SelfElement = HTMLElementTagNameMap[typeof self.tag]
type ComponentFunc = Component<{
  props: Props
  injects?: Injects
}>
type This = {
  Props: Props
  Injects: Injects
  Element: SelfElement
  Component: ComponentFunc
}
export default This;
