import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Command } from '../Interfaces/Command';
import { CanvasDrawService } from './CanvasDraw.service';

const RE_EXTRACT_COMMAND_AND_PARAMS = /.+?\b/gm;

@Injectable({
  providedIn: 'root',
})
export class CommandExecutionService {
  constructor(private canvasDrawService: CanvasDrawService) {
    this.extractCommands$.pipe(
      map((instructionLine) => {
        return this._extractSingleLineCommand(instructionLine)
      }),
      tap(command => {
        this._execute(command);
      })
    )
    .subscribe();
  }

  extractCommands$ = new BehaviorSubject<string>('');

  resetCanvas() {
    this.canvasDrawService.reset();
  }

  private _execute(command: Command) {
    const parameter = command.parameter.map((a) => parseInt(a));
    switch (command.command) {
      case 'forward':
        // @ts-ignore
        this.canvasDrawService.forward(...parameter);
        break;
      case 'backward':
        // @ts-ignore
        this.canvasDrawService.backward(...parameter);
        break;
      case 'turnleft':
        // @ts-ignore
        this.canvasDrawService.left(...parameter);
        break;
      case 'turnright':
        // @ts-ignore
        this.canvasDrawService.right(...parameter);
        break;
      case 'direction':
        // @ts-ignore
        this.canvasDrawService.angle(...parameter);
        break;
      case 'center':
        this.canvasDrawService.center();
        break;
      case 'go':
        // @ts-ignore
        this.canvasDrawService.goto(...parameter);
        break;
      case 'gox':
        // @ts-ignore
        this.canvasDrawService.gox(...parameter);
        break;
      case 'goy':
        // @ts-ignore
        this.canvasDrawService.goy(...parameter);
        break;
      case 'penup':
        this.canvasDrawService.penup();
        break;
      case 'pendown':
        this.canvasDrawService.pendown();
        break;
      case 'penwidth':
        // @ts-ignore
        this.canvasDrawService.width(...parameter);
        break;
      case 'pencolor':
        // @ts-ignore
        this.canvasDrawService.color(...parameter);
        break;
    }
  }

  private _extractSingleLineCommand(instruction: string) {
    const extractedInstruction =
      instruction.match(RE_EXTRACT_COMMAND_AND_PARAMS) || ([] as string[]);
    const trimmedExtractedInstruction = extractedInstruction
      .map((command) => command.trim())
      .filter((i) => !!i && i !== ',');

    const commandString = trimmedExtractedInstruction.shift();
    const parameterString = trimmedExtractedInstruction;
    return {
      command: commandString,
      parameter: parameterString,
    } as Command;
  }
}
