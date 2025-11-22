import express from 'express';
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/earth', (req, res) => {
    res.render('earth')
});

app.listen(3000, () => {
    console.log('server started');
});