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

app.get('/', async (req, res) => {

    res.render('index');
});

app.get('/agile', (req, res) => {

    res.render('agile');
});

app.get('/scrum', (req, res) => {

    res.render('scrum');
});

app.get('/comparison', (req, res) => {

    res.render('comparison');
});

app.get('/agile-simulator', async (req, res) => {
    //use faker from Node Package to generate fake backlog items
    const backlogItems = Array.from({ length: 6 }).map(() => ({
        title: faker.hacker.phrase(),
        type: faker.helpers.arrayElement(['Feature', 'Bug', 'Task']),
        assignee: faker.person.fullName(),
        estimate: faker.number.int({ min: 1, max: 8 }),
        status: faker.helpers.arrayElement(['To Do', 'In Progress', 'Done'])
    }));

    //use faker from Node Package to generate fake sprint summary
    const sprintInfo = {
        sprintName: `Sprint ${faker.number.int({ min: 1, max: 5 })}`,
        startDate: faker.date.soon({ days: 1 }),
        endDate: faker.date.soon({ days: 14 }),
        scrumMaster: faker.person.fullName()
    };

    //use Web API for tecky phrase
    const techyRes = await axios.get('https://techy-api.vercel.app/api/json');
    const techyPhrase = techyRes.data.message;

    res.render('agile-simulator', {
        backlogItems,
        sprintInfo,
        techyPhrase
    });
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