const express = require('express');
const { userRouter } = require('./routes/userRoutes');
const articleRoute = require('./routes/articleRoutes');
const { connect } = require('./db/connection');
const auth = require('./middlewares/auth')
const logger = require('./logger');
const winston = require('winston');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


connect();

// Routes
app.use('/users', userRouter);
app.use('/articles', articleRoute);



app.get("/", (req, res) => {
  res.render("home");
});

app.get("/publishedarticles", async (req, res) => {
  try {
    // Fetch published articles from your database ( 'state' represents the publish state)
    const publishedArticles = await articleModel.find({ state: "published" });

    res.render("publishedArticles", { articles: publishedArticles });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/article/:_id", async (req, res) => {
  try {
    const articleId = req.params._id;
    const article = await articleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment the read_count by 1
    article.read_count = parseInt(article.read_count) + 1;
    await article.save();

    // Fetch the user information
    const user_id = article.user_id; // the user_id is stored in the article document
    const user = await userModel.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.render("article", { user_id:user_id, user:user, article:article, date: new Date() });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/allarticles", async (req, res) => {
  try {
    const user_id = req.query.user_id; // req.query to get user_id

    // Get search parameters from the query
    const searchAuthor = req.query.author;
    const searchTitle = req.query.title;

    // Get ordering parameters from the query
    const orderField = req.query.orderField; 
    const orderDirection = req.query.orderDirection;

    const totalArticles = await articleModel.countDocuments();
    const users = await userModel.find({ user_id });

    // Get page and limit from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3; // Set  default limit

    const totalPages = Math.ceil(totalArticles / limit);

    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    // Calculate the skip value
    const skip = (page - 1) * limit;

    // Create a query object to filter articles
    const query = {};

    //  conditions for author, title, and tags if provided
    if (searchAuthor) {
      query.author = searchAuthor;
    }
    if (searchTitle) {
      query.title = searchTitle;
    }
    if (searchTags) {
      query.tags = { $in: searchTags.split(",") };
    }
   
    // Create an order object for sorting
    const sort = {};

    if (orderField && (orderDirection === "asc" || orderDirection === "desc")) {
      sort[orderField] = orderDirection;
    }

    // Fetch articles based on pagination, search conditions, and sorting
    const articles = await articleModel.find(query)

      .skip(skip)
      .limit(limit)
      .sort(sort);

    
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        article.read_count += 1;        
      
        if (article.body) {
          console.log(`Article ${i} body:`, article.body);
      
          const words = article.body.split(' ');
          const reading_time = Math.ceil(words.length / 200);
          article.reading_time = reading_time;
        }
      
        await article.save();
      }

    res.status(200).render("allarticles", {
      user_id: user_id,
      users: users,
      page: page,
      totalPages: totalPages,
      totalArticles: totalArticles,
      limit: limit,
      articles: articles,
      date: new Date(),
    });
  } catch (err) {
    return res.json(err);
  }
});

app.get("/dashboard", auth.verifyToken, async (req, res) => {
  try {
    const user_id = req.user_id;
    const user = req.user;

    const articles = await articleModel.find({ user_id: user_id });

    // const users = await userModel.find({req.body.first_name })
    // console.log(articles)
    res
      .status(200)
      .render("dashboard", { user_id, user,  articles, date: new Date() });
  } catch (err) {
    return res.json(err);
  }
});

// app.get('/users/dashboard.css', (req, res) => {
//     res.type('text/css'); // Set the content type to CSS
//     res.sendFile(path.join(__dirname, 'public/dashboard.css'));
// });

app.get("/update/:_id", async (req, res) => {
  try {
    // Retrieve the article post by ID
    const postId = req.params._id;
    const article = await articleModel.findById(postId);

    if (!article) {
      return res.status(404).json({ message: "Article post not found" });
    }

    // Render the updateArticle.ejs template with the article post data
    res.render("updatearticle", { article });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get("/create", (req, res) => {
  res.render("createarticle");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/existinguser", (req, res) => {
  res.render("existinguser");
});

app.get("/invalidinfo", (req, res) => {
  res.render("invalidinfo");
});

app.get("/unknown", (req, res) => {
  res.render("unknown");
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} ${req.ip}`);
  next();
});

// Error Handling
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} ${req.ip}`);
  next();
});

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  // Handle errors and send a response
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
