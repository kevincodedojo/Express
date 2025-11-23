import express from 'express';

const planets = (await import('npm-solarsystem')).default;
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/earth', (req, res) => {
    let planetEarth = planets.getEarth();
    // console.log(planetEarth);
    res.render('earth', {planetEarth})
});

app.get('/mars', (req, res) => {
    let planetMars = planets.getMars();
    console.log(planetMars);
    res.render('mars', {planetMars})
});

app.listen(3000, () => {
    console.log('server started');
});