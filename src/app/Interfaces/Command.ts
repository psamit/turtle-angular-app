export interface Command {
  command:
    | 'forward'
    | 'backward'
    | 'turnleft'
    | 'turnright'
    | 'direction'
    | 'center'
    | 'go'
    | 'gox'
    | 'goy'
    | 'penup'
    | 'pendown'
    | 'penwidth'
    | 'pencolor';
  parameter: string[];
}
