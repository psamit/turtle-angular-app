export interface TurtleState {
  pos: {
    x: number;
    y: number;
  };
  angle: number;
  penDown: boolean;
  width: number;
  visible: boolean;
  redraw: boolean;
  wrap: boolean;
  shape: 'triangle';
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  gridStep: number;
}
