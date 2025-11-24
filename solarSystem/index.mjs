import express from 'express';
import fetch from 'node-fetch';

const planets = (await import('npm-solarsystem')).default;
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', async(req, res) => {
    let apiKey = "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";
    let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;
    let response = await fetch(url);
    let data = await response.json();
    let randomImage = data.urls.full;
    res.render('index', {"image":randomImage})
    // res.render('index', )
});

app.get('/nasa', async(req, res) => {
    
    let url = `https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=2025-11-11`;
    let response = await fetch(url);
    let nasaData = await response.json();
    res.render('nasa', {nasaData})
    
});

app.get('/mercury', (req, res) => {
    let planetMercury = planets.getMercury();
    
    res.render('mercury', {planetMercury})
});

app.get('/venus', (req, res) => {
    let planetVenus = planets.getVenus();
    
    res.render('venus', {planetVenus})
});

app.get('/earth', (req, res) => {
    let planetEarth = planets.getEarth();
    // console.log(planetEarth);
    res.render('earth', {planetEarth})
});

app.get('/mars', (req, res) => {
    let planetMars = planets.getMars();
    
    res.render('mars', {planetMars})
});

app.get('/jupiter', (req, res) => {
    let planetJupiter = planets.getJupiter();
    
    res.render('jupiter', {planetJupiter})
});

app.get('/saturn', (req, res) => {
    let planetSaturn = planets.getSaturn();
    
    res.render('saturn', {planetSaturn})
});

app.get('/uranus', (req, res) => {
    let planetUranus = planets.getUranus();
    
    res.render('uranus', {planetUranus})
});

app.get('/neptune', (req, res) => {
    let planetNeptune = planets.getNeptune();
    
    res.render('neptune', {planetNeptune})
});

app.listen(3000, () => {
    console.log('server started');
});