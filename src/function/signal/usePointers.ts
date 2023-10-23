import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";

type PointerStateType = "down" | "move" | "hold"
type PointerState = {
  pointerId: number
  type: PointerStateType
  down: PointerEvent
  move: PointerEvent
}
export const usePointers = <Ref extends Element>() => {
  const [pointers, setPointers] = createStore<PointerState[]>([]);
  const getFirstState = (event: PointerEvent, type: PointerStateType): PointerState => ({
    pointerId: event.pointerId,
    type,
    down: event,
    move: event,
  });
  const onPointerDown: JSX.EventHandlerUnion<Ref, PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setPointers(pointers.length, getFirstState(event, "down"));
    };
  const onPointerMove: JSX.EventHandlerUnion<Ref, PointerEvent>
    = (event) =>
      // setPointers((prev) => prev.map((it) => ({
      //   ...it,
      //   type: it.pointerId === event.pointerId ? "move" : "hold",
      //   move: it.pointerId === event.pointerId ? event : it.move,
      // })));
      setPointers(
        (it) => it.pointerId === event.pointerId,
        (prev) => ({
          ...prev,
          move: event,
          type: "move",
        })
      );
  const onPointerUp: JSX.EventHandlerUnion<Ref, PointerEvent>
    = (event) =>
      // setPointers(
      //   (it) => it.pointerId === event.pointerId,
      //   (prev) => ({
      //     ...prev,
      //     move: event,
      //     type: "up",
      //   })
      // );
      setPointers((prev) =>
        prev.filter((it) => it.pointerId !== event.pointerId)
      );

  const events = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
  return [pointers, events] as const;
};
