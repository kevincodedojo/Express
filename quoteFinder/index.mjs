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
app.get('/', async (req, res) => {
    //    res.send('Hello Express app!')
    // passing author name
    let authorSql = `SELECT authorId, firstName, lastName
                FROM q_authors
                ORDER BY lastName`;
    const [authorRows] = await pool.query(authorSql);

    // passing category
    let categorySql = `SELECT DISTINCT category
                        FROM q_quotes
                        ORDER BY category`;
    const [categoryRows] = await pool.query(categorySql);

    res.render('index', {
        "authors" : authorRows,
        "categories" : categoryRows

    });

});

app.get('/searchByKeyword', async (req, res) => {
    let userKeyword = req.query.keyword;
    let sql = `SELECT quote, authorId, firstName, lastName
                From q_quotes
                NATURAL JOIN q_authors
                WHERE quote LIKE ?`;
    let sqlParams = [`%${userKeyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", { "quotes": rows });

    // res.send(rows);
    // res.render('index');

});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT quote, authorId, firstName, lastName
                From q_quotes
                NATURAL JOIN q_authors
                WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", { "quotes": rows });

    // res.send(rows);
    // res.render('index');

}); 

app.get('/searchByCategory', async (req, res) => {
    let userCategory = req.query.category;
    let sql = `SELECT quote, authorId, firstName, lastName
                From q_quotes
                NATURAL JOIN q_authors
                WHERE category = ?`;
    let sqlParams = [userCategory];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", { "quotes": rows });

    // res.send(rows);
    // res.render('index');

}); 

app.get('/searchByLikes', async (req, res) => {
    let userLikeL = req.query.likeNumL;
    let userLikeR = req.query.likeNumR;
    let sql = `SELECT quote, authorId, firstName, lastName
                From q_quotes
                NATURAL JOIN q_authors
                WHERE likes >= ? AND likes <= ?`;
    let sqlParams = [userLikeL, userLikeR];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", { "quotes": rows });

}); 

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
                FROM q_authors
                WHERE authorId = ?
    `;
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);

});


app.get("/dbTest", async (req, res) => {
    try {
        // SELECT * FROM q_authors
        const [rows] = await pool.query("SELECT * FROM q_authors");
        // const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.listen(3000, () => {
    console.log("Express server running")
})

