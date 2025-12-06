import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using POST method
app.use(express.urlencoded({ extended: true }));
//setting up database connection pool
const pool = mysql.createPool({
    host: "o61qijqeuqnj9chh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ugrqthugq1mwg5vc",
    password: "nv019md5tln5timy",
    database: "qk970d7iirgndlst",
    connectionLimit: 10,
    waitForConnections: true
});
//routes
app.get('/', (req, res) => {
    // res.send('Hello Express app!')
    res.render('index');
});

//Display form for input Author information
app.get('/author/new', (req, res) => {
    
    res.render('newAuthor');
});


//submitting data to be stored in database
app.post('/author/new', async(req, res) => {

    let fName = req.body.fName;
    let lName = req.body.lName;
    let birthDay = req.body.birthDate;
    let deathDay = req.body.deathDate;
    let sex = req.body.sex;
    let profession = req.body.profession;
    let country = req.body.country;
    let portrait = req.body.portrait;
    let biography = req.body.biography;

    let auInsertSql = `INSERT INTO q_authors
                (firstName, lastName, dob, dod, sex, profession,
                country, portrait, biography)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
    let params = [fName, lName, birthDay, deathDay, sex, profession,
                    country, portrait, biography];
    const [authors] = await pool.query(auInsertSql, params);
    res.render("newAuthor",
                {"message": "Author added!"}
    );  
    
});

//Display all Authors information
app.get('/authors', async(req, res) => {

    let displayAuSql = `SELECT *
                FROM q_authors
                ORDER BY lastName
            `;

    const [authorRows] = await pool.query(displayAuSql);
    
    res.render('authorList', 
        {"authorRows" : authorRows}
    );
});

//Edit Authors information
app.get('/author/edit', async(req, res) => {
    let authorId = req.query.authorId;
    let authorInfoSql = `SELECT *,
                DATE_FORMAT(dob, '%y-%m-%d') dobISO
                FROM q_authors
                WHERE authorId = ${authorId}
            `;

    const [authorInfo] = await pool.query(authorInfoSql);
    
    res.render('editAuthor', 
        {"authorInfo" : authorInfo}
    );
});






app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest
app.listen(3000, () => {
    console.log("Express server running")
})