import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, ElementRef, EventEmitter, Inject, Input, Output, PLATFORM_ID, SimpleChanges, ViewChild } from "@angular/core";
import { filter, interval, Observable, ReplaySubject, take } from "rxjs";

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { initializeMode } from 'monaco-graphql/esm/initializeMode.js'

import { buildSchema } from 'graphql';
import { reporterDetail, TablesInterface } from "./monaco.model";

// import GraphQLWorker from 'monaco-graphql/esm/graphql.worker.js';

@Component({
    selector: 'app-monaco-editor',
    standalone: true,
    template: `<div #editorContainer [ngStyle]="{ height: containerHeight, width: containerWidth }"></div>`,
    imports: [CommonModule]
})

export class MonacoEditorComponent {

    @Input() schema: TablesInterface[] = []
    @Input() code: string = '';
    @Output() textChange = new EventEmitter<string>();
    @ViewChild('editorContainer', { static: false }) editorContainer?: ElementRef;

    private editor?: monaco.editor.IStandaloneCodeEditor;

    containerHeight = '500px'
    containerWidth = '500px'

    isLoading: boolean = true;
    screenSuggestions = []

    constructor(
    ) {
        
    }

    ngAfterViewInit(): void {
        if (this.editorContainer) {

            this.loadMonacoScripts().subscribe({
                next: (monaco) => {
                    if (!monaco?.editor) {
                        console.error('Monaco or Monaco Editor is not available');
                        return;
                    }


                    // this.initializeMonacoGraphQL(monaco)

                    this.screenSuggestions = this.schema.map(table => {
                        return {
                            label: table.label,
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: table.label,
                            detail: `Screen`
                        }
                    })
                    console.log("suggestion", this.screenSuggestions)

                    // monaco.editor.defineTheme('customTheme', {
                    //     rules: [{ token: 'custom-number', foreground: '#ff0000' }],
                    //     colors: { 'editor.foreground': '#ffff00' },
                    //     base: 'vs-dark',
                    //     inherit: true,
                    // });

                    // Register the GraphQL language
                    monaco.languages.register({ id: 'graphql' });
                    // Optionally, define a simple tokenizer for GraphQL (this could be more sophisticated)
                    monaco.languages.setMonarchTokensProvider('graphql', {
                        tokenizer: {
                            root: [
                                [/\bquery\b|\bmutation\b|\bsubscription\b/, 'keyword'],
                                [/\btype\b|\binput\b|\binterface\b|\bunion\b|\benum\b|\bscalar\b/, 'keyword'],
                                [/\bfragment\b/, 'keyword'],
                                [/\bon\b/, 'keyword'],
                                [/\btrue\b|\bfalse\b/, 'keyword'],
                                [/[{}[\]()]/, '@brackets'],
                                [/[a-z_$][\w$]*/, 'identifier'],
                                [/\$[a-z_$][\w$]*/, 'variable'],
                            ],
                        },
                    });



                    monaco.languages.registerCompletionItemProvider('graphql', {
                        provideCompletionItems: (model: any, position: any) => {
                            const textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });

                            // Get the word at the current cursor position
                            const word = model.getWordUntilPosition(position);

                            // Check if the user is inside a class (inside curly brackets)
                            const lastOpeningBracket = textUntilPosition.lastIndexOf('{');
                            const lastClosingBracket = textUntilPosition.lastIndexOf('}');

                            const suggestions = []

                            if (lastOpeningBracket > lastClosingBracket) {

                                // Extract the class name before the opening bracket
                                const textBeforeBracket = textUntilPosition.slice(0, lastOpeningBracket).trim().split(/\s+/);
                                const screenName = textBeforeBracket[textBeforeBracket.length - 1];
                            
                                let findScreen = this.schema.find(x => x.label == screenName)
                                if (findScreen) {
                                    const fieldSuggestions = findScreen.columns.map(col => ({
                                        label: col.label,
                                        kind: monaco.languages.CompletionItemKind.Field,
                                        insertText: col.label,
                                        detail: `Field of type ${col.type}`
                                    }))
                                    suggestions.push(...fieldSuggestions)
                                    return { suggestions }
                                }

                                suggestions.push(...this.screenSuggestions)
                            }

                            return { suggestions }
                        }
                    })

                    // monaco.languages.register({ id: 'customLanguage' });
                    // monaco.languages.setMonarchTokensProvider('customLanguage', {
                    //     tokenizer: { root: [[/\b\d+\b/, 'custom-number']] },
                    // });

                    this.editor = monaco.editor.create(this.editorContainer?.nativeElement, {
                        value: this.code,
                        language: 'graphql', // Use GraphQL as the language
                        theme: 'vs-dark',
                        formatOnPaste: true,
                        automaticLayout: true
                    });

                    this.editor?.onDidChangeModelContent(() => {
                        const value = this.editor?.getValue();
                        this.textChange.emit(value);
                    });

                    this.isLoading = false;
                }, error: (error) => {
                    console.error('Error loading Monaco:', error);
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes && this.editor) {
        //     this.editor.setValue(changes ?? '');
        // }
    }

    generateGraphQLSuggestions(schema: TablesInterface[]) {
        const suggestions = [];

        schema.forEach((tab) => {
            tab.columns.forEach((col) => {
                suggestions.push({
                    label: col.label,
                    kind: monaco.languages.CompletionItemKind.Field,
                    insertText: col.label,
                    detail: `Field of type ${col.type}`
                })
            })
        })

        return suggestions
    }

    emitEditorContent(): string {
        return this.editor ? this.editor.getValue() : '';
    }

    private initializeMonacoGraphQL(monaco: any) {

        const myGraphqlSchema = buildSchema(`
            type Query {
                hello: String
                user(id: ID!): User
            }

            type User {
                id: ID
                name: String
                email: String
            }

            type Mutation {
                updateUser(id: ID!, name: String, email: String): User
            }
            `)

        initializeMode({
            schemas: [
                {
                    schema: myGraphqlSchema,
                    uri: './schema.graphql',
                    fileMatch: ['**/*.graphql'],
                },
            ],
        });

        const graphQLWorkerUrl = new URL('/assets/lib/monaco-graphql/esm/graphql.worker.js', import.meta.url);

        (window as any).MonacoEnvironment = {
            getWorker: function (_workerId: string, label: string) {
                if (label === 'graphql') {
                    return new Worker(graphQLWorkerUrl)
                } else {
                    return new Worker('/assets/lib/monaco-editor/esm/vs/editor/editor.worker.js', { type: 'module' });
                }
            },
        };
    }

    private loadMonacoScripts(): Observable<any> {
        const loader = new ReplaySubject<any>(1);

        if ((window as any).monacoEditorLoading) {
            interval(200)
                .pipe(filter((_) => (window as any).monaco), take(1))
                .subscribe((_) => {
                    loader.next((window as any).monaco);
                    loader.complete();
                });
            return loader;
        }

        (window as any).monacoEditorLoading = true;

        const script = document.createElement('script');
        script.src = '/assets/lib/monaco-editor/min/vs/loader.js';
        script.type = 'text/javascript';
        script.async = true;

        script.onload = () => {
            (window as any).require.config({ paths: { vs: '/assets/lib/monaco-editor/min/vs' } });
            (window as any).require(['vs/editor/editor.main'], () => {
                (window as any).MonacoEnvironment = {
                    getWorker: function (_workerId: string, label: string) {
                        return new Worker('/assets/lib/monaco-editor/esm/vs/editor/editor.worker.js', { type: 'module' });
                    },
                };
                loader.next((window as any).monaco);
                loader.complete();
            });
        };

        document.body.appendChild(script);
    

        return loader;
       
    }
}