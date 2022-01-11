import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, concatMap, debounceTime, delay, filter, from, of, switchMap, tap, timer } from 'rxjs';
import { CommandExecutionService } from '../../Services/CommandExecution.service';

@Component({
  selector: 'app-code-instruction',
  templateUrl: './code-instruction.component.html',
  styleUrls: ['./code-instruction.component.scss'],
})
export class CodeInstructionComponent implements OnInit {
  constructor(private commandExecutionService: CommandExecutionService) {
    this.drawCanvas$
    .pipe(
      debounceTime(1000),
      filter((isDraw) => isDraw),
      switchMap(() => {
        return this.extractInstructions();
      }),
      concatMap(val => {
        return of(val).pipe(delay(500))
      }),
      tap(instruction => {
        this.commandExecutionService.extractCommands$.next(instruction);
      })
    ).subscribe(() => {
      this.drawCanvas$.next(false);
    });
  }

  executedInstructions: string[] = [];

  instructions: string = '';
  drawCanvas$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {}

  onInstructionUpdate(event: Event) {
  }

  draw() {
    this.reset();
    this.drawCanvas$.next(true);
  }

  reset() {
    this.executedInstructions = [];
    this.commandExecutionService.resetCanvas();
  }

  extractInstructions() {
    const instructions = this.instructions
          .trim()
          .split('\n')
          .map((i) => i.trim())
          .filter((i) => !!i);

    return from(instructions)
  }

  animate() {
  }
}
