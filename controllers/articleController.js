const articleModel = require('../models/article')

const createArticle = async(req,res)  =>{
    const user_id= req.user_id
    const{title,description,author,timestamp,state,read_count,reading_time,body} = req.body;
    try{
       const existingArticle = await articleModel.findOne({
            title:title,
            description:description,
            author:author,
            state:state,
            user_id:user_id,
            body:body,

       });

       const article = await articleModel.create({
           title:title,
           description:description,
           author:author,
           state:state,
           user_id:user_id,
           body:body,
       });

       res.status(302).redirect('/dashboard');


    } catch(error) {
        console.log(error);
    }}


    const getAllArticles = async(req,res) =>{
        try{
            const user_id = req.query.user_id;
            const totalArticles= await articleModel.countDocuments();
            let page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const totalPages = Math.ceil(totalArticles/limit);

            if(page < 1){
                page=1;
            } else if (page>totalPages) {
                page = totalPages;
            }

            const skip = (page-1) * limit;

            const articles = await articleModel.find().skip(skip).limit(limit);

            for(let i = 0; i<articles.length; i++) {
                const articles =articles[i];
                articles.read_count = parseInt(article.read_count) + 1;
                await article.save();

                if(article.state ==='published' && articlepublishedAt)  {
                    article.publishedDate = article.publishedAt.toDateString();
                } else {
                    article.publishedDate = 'Not published yet';
                }

                const users = await articleModel.find({user_id});

                res.render('allarticles', {user_id:user_id,users:users,totalPages:totalPages,totalArticles: totalArticles, page:page, limit: limit, articles: articles, date: new Date() })
            }}catch (error) {
               console.log(error);
               res.status(400);
            }
        };

    const getOneArticle = async(req, res) =>{
        try{
            const articleId= req.params._id;
            const article = await articleModel.findById(articleId)
            
            if (!user) {
               return res.status(404).json({ message: 'User not found' });
            }

            res.render("article", { user_id: user_id, user: user, article: article, publishedDate: publishedDate, date: new Date() });
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        };


        const updateArticle = async (req, res) => {
        try {
            // Extract the Article post ID from the request parameters
            const postId = req.params._id;

            // Retrieve the existing  post from the database
            const existingArticlePost = await articleModel.findById(postId);

            if (!existingArticlePost) {
            return res.status(302).redirect("/create");
            }

            // Update the fields of the existing Article post
            existingArticlePost.title = req.body.title;
            existingArticlePost.description = req.body.description;
            existingArticlePost.tag = req.body.tag;
            existingArticlePost.author = req.body.author;
            existingArticlePost.state = req.body.state;
            existingArticlePost.body = req.body.body;

            if (req.body.state === 'published' && !existingArticlePost.publishedAt) {
            // Set the publishedAt date if the state is changed to 'published'
            existingArticlePost.publishedAt = new Date();
            }

            // Save the updated Article post
            const updatedArticlePost = await existingArticlePost.save();

            res.status(302).redirect("/dashboard");
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
        };


        const deleteArticle = async (req, res) => {
        try {
            const postId = req.params._id;

            // Deleting the Article post from the database
            const deletedArticlePost = await ArticleModel.findByIdAndDelete(postId);

            if (!deletedArticlePost) {
            return res.status(404).json({ message: "Article not found" });
            }

            res.status(302).redirect("/dashboard");
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
        };

        module.exports = {
            createArticle,
            getAllArticles,
            getOneArticle,
            updateArticle,
            deleteArticle,
        };

            


            
