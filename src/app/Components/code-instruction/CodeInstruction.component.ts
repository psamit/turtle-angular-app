import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { concatMap, debounceTime, delay, from, fromEvent, of, Subject, switchMap, tap } from 'rxjs';
import { CommandExecutionService } from '../../Services/CommandExecution.service';

@Component({
  selector: 'app-code-instruction',
  templateUrl: './code-instruction.component.html',
  styleUrls: ['./code-instruction.component.scss'],
})
export class CodeInstructionComponent implements OnInit, AfterViewInit {
  constructor(private commandExecutionService: CommandExecutionService) {}

  instructions: string = '';
  drawCanvas$ = new Subject();

  @ViewChild('drawCanvasBtn', { static: true }) drawCanvasBtn: ElementRef | null = null;
  @ViewChild('resetCanvasBtn', { static: true }) resetCanvasBtn: ElementRef | null = null;;


  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(this.drawCanvasBtn?.nativeElement, 'click')
      .pipe(
        debounceTime(1000),
        switchMap(() => {
          this.commandExecutionService.resetCanvas();
          return from(this.extractInstructions())
        }),
        concatMap(val => {
          return of(val).pipe(delay(500))
        }),
        tap(instruction => {
          this.commandExecutionService.extractCommands$.next(instruction);
        })
      ).subscribe();

    fromEvent(this.resetCanvasBtn?.nativeElement, 'click')
      .pipe(
        debounceTime(1000),
        tap(() => {
          this.commandExecutionService.resetCanvas();
        })
      ).subscribe();
  }

  private extractInstructions() {
    return this.instructions
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => !!i);
  }
}
