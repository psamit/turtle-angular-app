import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { CommandExecutionService } from '../../Services/CommandExecution.service';

@Component({
  selector: 'app-code-instruction',
  templateUrl: './code-instruction.component.html',
  styleUrls: ['./code-instruction.component.scss'],
})
export class CodeInstructionComponent implements OnInit {
  constructor(private commandExecutionService: CommandExecutionService) {
    this.drawCanvas$.pipe(filter((isDraw) => isDraw)).subscribe(() => {
      const instructions = this.instructions
        .trim()
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => !!i);
      this.commandExecutionService.extractCommands$.next(instructions);
      this.drawCanvas$.next(false);
    });
  }

  instructions: string = '';
  drawCanvas$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {}

  onInstructionUpdate(event: Event) {}

  draw() {
    this.reset();
    this.drawCanvas$.next(true);
  }

  reset() {
    this.commandExecutionService.resetCanvas();
  }

  animate() {
    // this.commandExecutionService.animate$.next(true);
  }
}
