import clsx from "clsx";
import {
  Component,
  JSX,
  createEffect,
} from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { ulid } from "ulid";

import styles from "./index.module.styl";
import NodeAdder from "./NodeAdder";

import { Calc } from "@/function/calcObj";
import { createCamera } from "@/function/signal/createCamera";
import { Node } from "@/type/domain/Node";
import { Position } from "@/type/domain/Position";
import { Size } from "@/type/domain/Size";

const name = "NodesBoard";
const injectTag = "div";
type Props = {
  nodes: Node[]
  setNodes: SetStoreFunction<Node[]>
  baseCellSize: Size
  scaleRatioOnWheel: number
}
const Self: ComponentFunc = (_props) => {
  const props = () => _props.props;
  const injects = () => _props.injects;

  const nodes = () => props().nodes;
  const setNodes = () => props().setNodes;
  const cellSize = () => props().baseCellSize;
  const scaleRatioOnWheel = () => props().scaleRatioOnWheel;

  const [camera, setCamera, cameraAction] = createCamera();
  const translate = () => camera.translate;
  const scale = () => camera.scale;

  const [pointers, setPointers] = createStore<PointerEvent[]>([]);
  createEffect(() => {
    const points = pointers.map(Position.from);
    cameraAction.scale(points, true);
  });
  const onPointerDown: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setPointers(pointers.length, event);
    };
  const onPointerMove: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = (event) =>
      setPointers(
        (it) => it.pointerId === event.pointerId,
        event
      );
  const onPointerUp: JSX.EventHandlerUnion<This["Element"], PointerEvent>
    = (event) =>
      setPointers((prev) =>
        prev.filter((it) => it.pointerId !== event.pointerId)
      );
  const onWheel: JSX.EventHandlerUnion<This["Element"], WheelEvent>
    = (event) => {
      const scalar = scaleRatioOnWheel();
      const cursorOnScreen = Position.from(event);
      const calculator = event.deltaY < 0 ? "/" : "*";
      setCamera.scale((prev) => Calc[calculator](prev, scalar), { origin: cursorOnScreen });
    };

  const cellFromAtCamera = (atCamera: Position) => {
    const atBoardScaled = Calc["+"](camera.position, atCamera);
    const atBoard = Calc["/"](atBoardScaled, Size.toPosition(camera.scale));
    const cell = Calc["/"](atBoard, Size.toPosition(cellSize()));
    return cell;
  };
  // const atCameraFromCell = (cell: Position) => {
  //   const atBoard = Calc["*"](cell, Size.toPosition(cellSize()));
  //   const atBoardScaled = Calc["*"](atBoard, Size.toPosition(camera.scale));
  //   const atCamera = Calc["-"](atBoardScaled, camera.position);
  //   return atCamera;
  // };

  const addNode = (cell: Position) =>
    setNodes()(nodes().length, {
      id: ulid(),
      position: { ...cell },
      size: {
        width: 1,
        height: 1,
      },
      content: "added",
    });

  return (
    <div
      {...injects()}
      class={clsx(name, styles[name], injects()?.class)}
      style={{
        "--translate-x": `${translate().x}px`,
        "--translate-y": `${translate().y}px`,
        "--scale-x": `${scale().width}`,
        "--scale-y": `${scale().height}`,
        "--cell-size-x": `${cellSize().width}px`,
        "--cell-size-y": `${cellSize().height}px`,
      }}
    >
      <div
        class={styles.ActionDetector}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      />
      {/* <For each={nodes()}>{(node) =>
        <NodeView
          props={{
            node: node,
            setNode: toPartial(setNodes())((prev) => prev.id === node.id),
            cellSize: cellSize(),
            camera: camera,
          }}
        />
      }</For> */}
      <NodeAdder props={{
        addNode: addNode,
        cellFromAtCamera,
      }} />
    </div>
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
