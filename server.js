// server.js — Backend proxy para o SerpApi
// Instale as dependências: npm install express node-fetch cors
// Rode com: node server.js

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001;

// ⚠️ COLOQUE SUA CHAVE DO SERPAPI AQUI
const SERPAPI_KEY = '5985ec6ead17b708817e133c1a1da01cbbd96fcf3d77e10abc23023151d88871';

app.use(cors());
app.use(express.json());

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

    // Mapeia para o formato que o painel espera
    const produtos = data.shopping_results.map(item => ({
      name: item.title,
      seller: item.source || 'Loja Online',
      price: item.extracted_price || 0,
      rating: item.rating || 0,
      link: item.link || '#',
      icon: 'ti-shopping-bag',
    }));

    res.json(produtos);
  } catch (error) {
    console.error('Erro ao chamar SerpApi:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Teste: http://localhost:${PORT}/buscar?q=farinha+de+trigo`);
});
