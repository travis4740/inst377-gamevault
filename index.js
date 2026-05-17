const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

const RAWG_KEY = process.env.RAWG_KEY;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.get('/api/games', async (req, res) => {
  console.log('Fetching trending games from RAWG');
  const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&ordering=-rating&page_size=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/games/search', async (req, res) => {
  const query = req.query.q;
  console.log('Searching RAWG for: ${query}');
  const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${query}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/games/new', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const fromDate = lastMonth.toISOString().split('T')[0];
  const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&dates=${fromDate},${today}&ordering=-added&page_size=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/games/upcoming', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const toDate = nextYear.toISOString().split('T')[0];
  const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&dates=${today},${toDate}&ordering=-added&page_size=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/games/genre/:genre', async (req, res) => {
  const genre = req.params.genre;
  const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&genres=${genre}&ordering=-rating&page_size=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/games/:id', async (req, res) => {
  const id = req.params.id;
  console.log('Fetching game detail for id: ${id}');
  const url = `https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/games/:id/screenshots', async (req, res) => {
  const id = req.params.id;
  const url = `https://api.rawg.io/api/games/${id}/screenshots?key=${RAWG_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/games/:id/similar', async (req, res) => {
  const id = req.params.id;
  const url = `https://api.rawg.io/api/games/${id}/game-series?key=${RAWG_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  }
});

app.get('/api/favorites', async (req, res) => {
  console.log('Fetching favorites from Supabase');
  const { data, error } = await supabase.from('favorites').select();
  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

app.post('/api/favorites', async (req, res) => {
  console.log('Saving game to favorites');
  const game_id = req.body.game_id;
  const name = req.body.name;
  const cover_image = req.body.cover_image;
  const { data, error } = await supabase
    .from('favorites')
    .insert({ game_id, name, cover_image })
    .select();
  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Removing favorite: ${id}`);
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id)
    .select();
  if (error) {
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});