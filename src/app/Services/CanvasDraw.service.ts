import { Injectable } from '@angular/core';
import { TurtleState } from '../Interfaces/TurtleState';

@Injectable({
  providedIn: 'root',
})
export class CanvasDrawService {
  constructor() {}

  imageCanvas: any;
  imageContext: any;
  turtleCanvas: any;
  turtleContext: any;

  shapes = {
    triangle: [
      [-5, 0],
      [5, 0],
      [0, 15],
    ],
  };

  turtleInitialState: TurtleState = {
    pos: {
      x: 0,
      y: 0,
    },
    angle: 0,
    penDown: true,
    width: 1,
    visible: true,
    redraw: true,
    wrap: false,
    shape: 'triangle',
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
    gridStep: 10,
  };

  turtleState: TurtleState = { ...this.turtleInitialState };

  initialize() {
    this.imageCanvas = document.querySelector('#imagecanvas');
    this.imageContext = this.imageCanvas.getContext('2d');
    this.turtleCanvas = document.querySelector('#turtlecanvas');
    this.turtleContext = this.turtleCanvas.getContext('2d');

    this.imageContext.lineWidth = this.turtleState.width;
    this.imageContext.strokeStyle = 'black';
    this.imageContext.globalAlpha = 1;
    this.imageContext.textAlign = 'center';
    this.imageContext.textBaseline = 'middle';
    this.turtleContext.globalCompositeOperation = 'destination-over';
    this.turtleState = { ...this.turtleInitialState };
    this.showGrid(this.turtleState.gridStep);
    this.draw();
  }

  drawIf() {
    if (this.turtleState.redraw) {
      this.draw();
    }
  }

  draw() {
    this.clearContext(this.turtleContext);
    if (this.turtleState.visible) {
      const x = this.turtleState.pos.x;
      const y = this.turtleState.pos.y;
      const w = 10;
      const h = 15;
      this.turtleContext.save();
      // use canvas centered coordinates facing upwards
      this.centerCoords(this.turtleContext);
      // move the origin to the turtle center
      this.turtleContext.translate(x, y);
      // rotate about the center of the turtle
      this.turtleContext.rotate(-this.turtleState.angle);
      // move the turtle back to its position
      this.turtleContext.translate(-x, -y);
      // draw the turtle icon
      const icon = this.shapes.hasOwnProperty(this.turtleState.shape)
        ? this.turtleState.shape
        : 'triangle';
      this.turtleContext.beginPath();
      this.turtleContext.moveTo(x - w / 2, y);
      this.turtleContext.lineTo(x + w / 2, y);
      this.turtleContext.lineTo(x, y + h);

      this.turtleContext.closePath();
      this.turtleContext.fillStyle = 'green';
      this.turtleContext.fill();
      this.turtleContext.restore();
    }
    this.turtleContext.drawImage(
      this.imageCanvas,
      0,
      0,
      750,
      450,
      0,
      0,
      750,
      450,
    );
  }

  centerCoords(context: any) {
    const width = context.canvas.width;
    const height = context.canvas.height;
    context.translate(width / 2, height / 2);
    context.transform(1, 0, 0, -1, 0, 0);
  }

  clear() {
    this.clearContext(this.imageContext);
    this.drawIf();
  }

  clearContext(context: any) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.restore();
  }

  reset() {
    this.clear();
    this.goto(0, 0);
    this.initialize();
  }

  write(msg: string) {
    this.imageContext.save();
    this.centerCoords(this.imageContext);
    this.imageContext.translate(this.turtleState.pos.x, this.turtleState.pos.y);
    this.imageContext.transform(1, 0, 0, -1, 0, 0);
    this.imageContext.translate(
      -this.turtleState.pos.x,
      -this.turtleState.pos.y,
    );
    this.imageContext.fillText(
      msg,
      this.turtleState.pos.x,
      this.turtleState.pos.y,
    );
    this.imageContext.restore();
    this.drawIf();
  }

  showGrid(step: number) {
    this.angle(0);
    this.goto(25, 10);
    this.write('(0,0)');
    this.goto(360, 10);
    this.write('X');
    this.goto(10, 215);
    this.write('Y');

    this.goto(0, 0);

    this.width(0.5);
    for (let i = 0; i < 4; i++) {
      this.goto(0, 0);
      this.forward(375);
      this.left(90);
    }

    this.width(0.2);
    for (let x = 0; x < 375; x += step) {
      this.goto(-1 * x, 0);
      this.forward(225);
      this.goto(x, 0);
      this.forward(225);
    }
    this.left(180);
    for (let x = 0; x > -375; x -= step) {
      this.goto(-1 * x, 0);
      this.forward(225);
      this.goto(x, 0);
      this.forward(225);
    }

    this.left(90);
    for (let y = 0; y < 225; y += step) {
      this.goto(0, -1 * y);
      this.forward(375);
      this.goto(0, y);
      this.forward(375);
    }
    this.left(180);
    for (let y = 0; y > -225; y -= step) {
      this.goto(0, -1 * y);
      this.forward(375);
      this.goto(0, y);
      this.forward(375);
    }

    this.goto(0, 0);
    this.angle(0);
    this.width(1);
  }

  forward(distance: number) {
    this.imageContext.save();
    this.centerCoords(this.imageContext);
    this.imageContext.beginPath();

    const maxX = this.imageContext.canvas.width / 2;
    const minX = -this.imageContext.canvas.width / 2;
    const maxY = this.imageContext.canvas.height / 2;
    const minY = -this.imageContext.canvas.height / 2;
    let x = this.turtleState.pos.x;
    let y = this.turtleState.pos.y;

    while (distance > 0) {
      this.imageContext.moveTo(x, y);
      const cosAngle = Math.cos(this.turtleState.angle);
      const sinAngle = Math.sin(this.turtleState.angle);
      const newX = x + sinAngle * distance;
      const newY = y + cosAngle * distance;

      const xWrap = (cutBound: number, otherBound: number) => {
        const distanceToEdge = Math.abs((cutBound - x) / sinAngle);
        const edgeY = cosAngle * distanceToEdge + y;
        this.imageContext.lineTo(cutBound, edgeY);
        distance -= distanceToEdge;
        x = otherBound;
        y = edgeY;
      };

      const yWrap = (cutBound: number, otherBound: number) => {
        const distanceToEdge = Math.abs((cutBound - y) / cosAngle);
        const edgeX = sinAngle * distanceToEdge + x;
        this.imageContext.lineTo(edgeX, cutBound);
        distance -= distanceToEdge;
        x = edgeX;
        y = otherBound;
      };

      const noWrap = () => {
        this.imageContext.lineTo(newX, newY);
        this.turtleState.pos.x = newX;
        this.turtleState.pos.y = newY;
        distance = 0;
      };

      if (this.turtleState.wrap) {
        if (this.insideCanvas(newX, newY, minX, maxX, minY, maxY)) {
          noWrap();
        } else if (this.intersect(x, y, newX, newY, maxX, maxY, maxX, minY))
          xWrap(maxX, minX);
        else if (this.intersect(x, y, newX, newY, minX, maxY, minX, minY))
          xWrap(minX, maxX);
        else if (this.intersect(x, y, newX, newY, minX, maxY, maxX, maxY))
          yWrap(maxY, minY);
        else if (this.intersect(x, y, newX, newY, minX, minY, maxX, minY))
          yWrap(minY, maxY);
        // No wrapping to to, new turtle position is within the canvas.
        else noWrap();
      } else {
        noWrap();
      }
    }
    // only draw if the pen is currently down.
    if (this.turtleState.penDown) {
      this.imageContext.stroke();
    }
    this.imageContext.restore();
    this.drawIf();
  }

  backward(distance: number) {
    this.left(180);
    this.forward(distance);
    this.left(180);
  }

  center() {
    this.goto(0, 0);
    this.angle(0);
  }

  // turn edge wrapping on/off
  wrap(bool: boolean) {
    this.turtleState.wrap = bool;
  }

  insideCanvas(
    x: number,
    y: number,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
  ) {
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  intersect(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
  ) {
    const d = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / d;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;

    if (d === 0) {
      return undefined;
    } else if (ua < 0.01 || ua > 0.99 || ub < 0 || ub > 1) {
      return undefined;
    } else {
      return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) };
    }
  }

  // show/hide the turtle
  hideTurtle() {
    this.turtleState.visible = false;
    this.drawIf();
  }

  // show/hide the turtle
  showTurtle() {
    this.turtleState.visible = true;
    this.drawIf();
  }

  // turn on/off redrawing
  redrawOnMove(bool: boolean) {
    this.turtleState.redraw = bool;
  }

  penup() {
    this.turtleState.penDown = false;
  }

  pendown() {
    this.turtleState.penDown = true;
  }

  right(angle: number) {
    this.turtleState.angle += this.degToRad(angle);
    this.drawIf();
  }

  // turn left by an angle in degrees
  left(angle: number) {
    this.turtleState.angle -= this.degToRad(angle);
    this.drawIf();
  }

  // move the turtle to a particular coordinate (don't draw on the way there)
  goto(x: number, y: number) {
    this.turtleState.pos.x = x;
    this.turtleState.pos.y = y;
    this.drawIf();
  }

  gox(x: number) {
    this.turtleState.pos.x = x;
    this.drawIf();
  }

  goy(y: number) {
    this.turtleState.pos.y = y;
    this.drawIf();
  }

  angle(angle: number) {
    this.turtleState.angle = this.degToRad(angle);
    this.drawIf();
  }

  // convert degrees to radians
  degToRad(deg: number) {
    return (deg / 180) * Math.PI;
  }

  radToDeg(rad: number) {
    return (rad * 180) / Math.PI;
  }
  width(w: number) {
    this.turtleState.width = w;
    this.imageContext.lineWidth = w;
  }
  // set the turtle draw shape, currently supports
  // triangle (default), circle, square and turtle
  shape(s: 'triangle') {
    this.turtleState.shape = s;
    this.draw();
  }

  // set the colour of the line using RGB values in the range 0 - 255.
  color(r: number, g: number, b: number) {
    const a = 1;
    this.imageContext.strokeStyle =
      'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    this.turtleState.color.r = r;
    this.turtleState.color.g = g;
    this.turtleState.color.b = b;
    this.turtleState.color.a = a;
  }

  // Generate a random integer between low and hi
  random(low: number, hi: number) {
    return Math.floor(Math.random() * (hi - low + 1) + low);
  }

  repeat(n: number, action: () => any) {
    for (let count = 1; count <= n; count++) {
      action();
    }
  }

  animate(f: () => any, ms: number) {
    return setInterval(f, ms);
  }

  setFont(font: string) {
    this.imageContext.font = font;
  }
}
