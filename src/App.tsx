import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import './App.css'

const defaultCode = `package main

import "fmt"

func main() {
    fmt.Println("Hello, Golang Interview Prep!")
    
    // Your code here
}
`

interface ExecutionResult {
  output: string
  error: string
  isRunning: boolean
}

function App() {
  const [code, setCode] = useState(defaultCode)
  const [fontSize, setFontSize] = useState(18)
  const [menuOpen, setMenuOpen] = useState(false)
  const [splitScreenEnabled, setSplitScreenEnabled] = useState(false)
  const [filename, setFilename] = useState('main.go')
  const [result, setResult] = useState<ExecutionResult>({
    output: '',
    error: '',
    isRunning: false
  })
  const editorRef = useRef<any>(null)
  const editorRef2 = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor

    // Add Ctrl+Scroll to change font size
    const domNode = editor.getDomNode()
    if (domNode) {
      domNode.addEventListener('wheel', (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          
          const delta = e.deltaY > 0 ? -1 : 1
          setFontSize(prev => {
            const newSize = prev + delta
            // Clamp between 10 and 24
            return Math.min(24, Math.max(10, newSize))
          })
        }
      }, { passive: false })
    }

    // Monaco's built-in word-based suggestions provide autocomplete
    // for user-defined variables and functions
  }

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const executeCode = async () => {
    setResult({ output: '', error: '', isRunning: true })
    
    try {
      const apiUrl = '/api/execute';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error('Failed to execute code');
      }

      const data = await response.json();
      
      if (data.Errors) {
        setResult({ output: '', error: data.Errors, isRunning: false })
      } else {
        const events = data.Events || []
        const output = events
          .filter((e: any) => e.Kind === 'stdout' || e.Kind === 'stderr')
          .map((e: any) => e.Message)
          .join('')
        
        setResult({ 
          output: output || '(no output)', 
          error: '', 
          isRunning: false 
        })
      }
    } catch (error) {
      setResult({ 
        output: '', 
        error: `Execution failed: ${error instanceof Error ? error.message : String(error)}`, 
        isRunning: false 
      })
    }
  }

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <button 
        className="hamburger-button" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">⚙</span>
      </button>

      <button 
        className="floating-run-button" 
        onClick={executeCode}
        disabled={result.isRunning}
        aria-label="Run code"
      >
        {result.isRunning ? '⏳' : '▶'}
      </button>

      <button 
        className="floating-split-button" 
        onClick={() => setSplitScreenEnabled(!splitScreenEnabled)}
        aria-label="Toggle split screen"
        title={splitScreenEnabled ? "Disable split screen" : "Enable split screen"}
      >
        {splitScreenEnabled ? '⊟' : '⊞'}
      </button>

      {menuOpen && (
        <>
          <div className="overlay" onClick={() => setMenuOpen(false)} />
          <div className="sidebar-menu">
            <div className="menu-header">
              <h2 className="menu-title">Settings</h2>
              <button 
                className="close-button" 
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="menu-content">
              <div className="menu-section">
                <label className="menu-label">Font Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="menu-select"
                >
                  <option value={10}>10px</option>
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                  <option value={20}>20px</option>
                  <option value={22}>22px</option>
                  <option value={24}>24px</option>
                </select>
              </div>

              <div className="menu-section">
                <label className="menu-label">Save Code</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="menu-input"
                  placeholder="filename.go"
                />
                <button
                  onClick={saveCode}
                  className="save-button"
                >
                  💾 Save to Downloads
                </button>
              </div>
            </div>
            
            <div className="menu-footer">
              <img src="/gopher.png" alt="Go Gopher" className="gopher-image" />
            </div>
          </div>
        </>
      )}
      
      <div className="main-content">
        <div className={`editor-container ${splitScreenEnabled ? 'split-screen' : ''}`}>
          <div className={splitScreenEnabled ? 'editor-pane' : 'editor-full'}>
            <Editor
              height="100%"
              defaultLanguage="go"
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: false,
                quickSuggestions: {
                  other: 'on',
                  comments: 'off',
                  strings: 'off'
                },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                tabCompletion: 'on',
                wordBasedSuggestions: 'allDocuments',
                parameterHints: {
                  enabled: true
                },
                suggest: {
                  showWords: true,
                  showSnippets: true,
                  localityBonus: true,
                  filterGraceful: true
                },
                hover: {
                  enabled: true
                }
              }}
            />
          </div>
          {splitScreenEnabled && (
            <div className="editor-pane">
              <Editor
                height="100%"
                defaultLanguage="go"
                value={code}
                onMount={(editor: any) => { editorRef2.current = editor }}
                theme="vs-dark"
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: false,
                  readOnly: true,
                  quickSuggestions: false,
                  suggestOnTriggerCharacters: false,
                  acceptSuggestionOnEnter: 'off',
                  tabCompletion: 'off',
                  wordBasedSuggestions: 'off',
                  parameterHints: { enabled: false },
                  suggest: { showWords: false, showSnippets: false },
                  hover: { enabled: true }
                }}
              />
            </div>
          )}
        </div>
        
        {(result.output || result.error) && (
          <div className="output-panel">
            <div className="output-header">
              <span>Output</span>
              <button 
                className="clear-button" 
                onClick={() => setResult({ output: '', error: '', isRunning: false })}
              >
                Clear
              </button>
            </div>
            <pre className="output-content">
              {result.error && <div className="error-output">{result.error}</div>}
              {result.output && <div className="success-output">{result.output}</div>}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
