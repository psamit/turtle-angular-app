import { Component, OnInit } from '@angular/core';
import { CanvasDrawService } from '../../Services/CanvasDraw.service';

@Component({
  selector: 'app-canvas-output',
  templateUrl: './canvas-output.component.html',
  styleUrls: ['./canvas-output.component.scss'],
})
export class CanvasOutputComponent implements OnInit {
  constructor(private canvasDrawService: CanvasDrawService) {}

  ngOnInit(): void {
    this.canvasDrawService.initialize();
  }
}
