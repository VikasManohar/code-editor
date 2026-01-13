import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/execute', async (req, res) => {
  try {
    const { code } = req.body;
    
    const response = await fetch('https://play.golang.org/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        version: '2',
        body: code,
        withVet: 'true'
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      Errors: `Server error: ${error.message}` 
    });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Golang Interview Prep Editor is running!`);
  console.log(`📝 Open your browser to: http://localhost:${PORT}`);
  console.log(`⚙️  Press Ctrl+C to stop the server`);
});
