import express from 'express';
// import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';
import axios from 'axios';



// const planets = (await import('npm-solarsystem')).default;
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));

//pass currentPath to nav
app.use((req, res, next) => {
  res.locals.currentPath = req.path;  
  next();
});

app.get('/', async(req, res) => {
    
    res.render('index' )
});

app.get('/agile', (req, res) => {
    
    res.render('agile')
});

app.get('/scrum', (req, res) => {
    
    res.render('scrum')
});

app.get('/comparison', (req, res) => {
    
    res.render('comparison')
});

app.get('/agile-simulator', (req, res) => {
    
    
    res.render('agile-simulator')
});


// app.get('/nasa', async(req, res) => {
    
//     let url = `https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=2025-11-11`;
//     let response = await fetch(url);
//     let nasaData = await response.json();
//     res.render('nasa', {nasaData})
    
// });

// app.get('/mercury', (req, res) => {
//     let planetMercury = planets.getMercury();
    
//     res.render('mercury', {planetMercury})
// });



app.listen(3000, () => {
    console.log('server started');
});