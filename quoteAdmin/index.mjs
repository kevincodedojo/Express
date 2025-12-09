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

//Display form for input Quote information
app.get('/quote/new', (req, res) => {
    
    res.render('newQuote');
});


//submitting Author data to be stored in database
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

//submitting Quote data to be stored in database
app.post('/quote/new', async(req, res) => {

    let quote = req.body.quote;
    let authorId = req.body.authorId;
    let category = req.body.category;
    let likes = req.body.likes;
    

    let quoteInsertSql = `INSERT INTO q_quotes
                (quote, authorId, category, likes)
                VALUES (?, ?, ?, ?)
                `;
    let params = [quote, authorId, category, likes];
    const [newQuote] = await pool.query(quoteInsertSql, params);
    res.render("newQuote",
                {"message": "Quote added!"}
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

//Display all Quotes information
app.get('/quotes', async(req, res) => {

    let displayQuoteSql = `SELECT *
                FROM q_quotes
                ORDER BY quoteId
            `;

    const [quoteRows] = await pool.query(displayQuoteSql);
    
    res.render('quoteList', 
        {"quoteRows" : quoteRows}
    );
});

//Display Editable Authors information
app.get('/author/edit', async(req, res) => {
    let authorId = req.query.authorId;
    let authorInfoSql = `SELECT *,
                DATE_FORMAT(dob, '%Y-%m-%d') dobISO,
                DATE_FORMAT(dod, '%Y-%m-%d') dodISO
                FROM q_authors
                WHERE authorId = ${authorId}
            `;

    const [authorInfo] = await pool.query(authorInfoSql);
    
    res.render('editAuthor', 
        {"authorInfo" : authorInfo}
    );
});

//Display Editable Quote information
app.get('/quote/edit', async(req, res) => {
    let quoteId = req.query.quoteId;
    let quoteInfoSql = `SELECT *
                FROM q_quotes
                WHERE quoteId = ${quoteId}
            `;

    const [quoteInfo] = await pool.query(quoteInfoSql);
    
    res.render('editQuote', 
        {"quoteInfo" : quoteInfo}
    );
});

//Update Authors information
app.post("/author/edit", async (req, res) => {

    let updateAuthorInfoSql = `
        UPDATE q_authors
        SET firstName = ?,
            lastName = ?,
            dob = ?,
            dod = ?,
            sex = ?,
            profession = ?,
            country = ?,
            portrait = ?,
            biography = ?
        WHERE authorId = ?
    `;

    let params = [
        req.body.fName,
        req.body.lName,
        req.body.birthDate,
        req.body.deathDate,
        req.body.sex,
        req.body.profession,
        req.body.country,
        req.body.portrait,
        req.body.biography,
        req.body.authorId
    ];

    const [updateAuthorInfo] = await pool.query(updateAuthorInfoSql, params);
    res.redirect("/authors");

});

//Update Quote information
app.post("/quote/edit", async (req, res) => {

    let updateQuoteInfoSql = `
        UPDATE q_quotes
        SET quote = ?,
            authorId = ?,
            category = ?,
            likes = ?
        WHERE quoteId = ?
    `;

    let params = [
        req.body.quote,
        req.body.authorId,
        req.body.category,
        req.body.likes,
        req.body.quoteId
    ];

    const [updateQuoteInfo] = await pool.query(updateQuoteInfoSql, params);
    res.redirect("/quotes");

});

//Delete author
app.get("/author/delete", async(req,res) => {

    let authorId = req.query.authorId;

    let deleteSql = `
        DELETE
        FROM q_authors
        WHERE authorId = ?
    `;

    const [rows] = await pool.query(deleteSql, [authorId]);

    res.redirect("/authors");

});

//Delete quote
app.get("/quote/delete", async(req, res) => {

    let quoteId = req.query.quoteId;

    let deleteSql = `
        DELETE
        FROM q_quotes
        WHERE quoteId = ?
    `;

    const [rows] = await pool.query(deleteSql, [quoteId]);

    res.redirect("/quotes");

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