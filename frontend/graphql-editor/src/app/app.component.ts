import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonacoEditorComponent } from "./monaco-editor/monaco-editor.component";
import { reporterDetail } from './monaco-editor/monaco.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MonacoEditorComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'graphql-editor';



  schema = reporterDetail

}
