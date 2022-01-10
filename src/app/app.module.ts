import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './Components/app.component';
import { MainContainerComponent } from './Components/main-container/MainContainer.component';
import { CodeInstructionComponent } from './Components/code-instruction/CodeInstruction.component';
import { CanvasOutputComponent } from './Components/canvas-output/CanvasOutput.component';

@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    CodeInstructionComponent,
    CanvasOutputComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
