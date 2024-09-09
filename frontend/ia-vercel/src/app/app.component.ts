import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonacoEditorComponent } from "./monaco-editor/monaco-editor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MonacoEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  title = 'ia-vercel';

  constructor(
  ) {

  }

  ngOnInit(): void {

  }

}
