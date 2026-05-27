import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const SERPAPI_KEY = '5985ec6ead17b708817e133c1a1da01cbbd96fcf3d77e10abc23023151d88871';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'painel.html'));
});

app.get('/buscar', async (req, res) => {
  const query = req.query.q || 'alimentos atacado';

  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_shopping');
  url.searchParams.set('q', query);
  url.searchParams.set('gl', 'br');
  url.searchParams.set('hl', 'pt');
  url.searchParams.set('api_key', SERPAPI_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data.shopping_results) {
      return res.json([]);
    }

    const produtos = data.shopping_results.map(item => ({
      name: item.title,
      seller: item.source || 'Loja Online',
      price: item.extracted_price || 0,
      rating: item.rating || 0,
      link: item.link || '#',
      thumbnail: item.thumbnail || null,
    }));

    res.json(produtos);
  } catch (error) {
    console.error('Erro ao chamar SerpApi:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
