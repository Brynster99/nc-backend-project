# <b>Northcoders News API</b>

## <b>Intro</b>

One week project completed during the Northcoders 13 week bootcamp built with PostgreSQL, Node.js, Express.js and hosted with Heroku.

## <b>Hosted API</b>

https://northcoders-backend-project.herokuapp.com

## <b>Minimum Requirements</b>

- Node.js (v16.13.1)
- PostgreSQL (v2.5.2)

<br>

## <b>Available Endpoints</b>

### <b>POST Endpoints</b>

> ### `POST /api/articles/:article_id/comments`
>
> add a comment for a particular article_id (if id exists)
>
> Example request body:  
> `{ "username": "butter_bridge", "body": "Wow, this is a great article!" }`
>
> Example response:  
> `{ "comment": { "comment_id": 396, "body": "Legendary", "article_id": 2, "author": "cooljmessy", "votes": 0, "created_at": "2022-04-06T15:27:15.888Z" } }`

<br>

### <b>GET Endpoints</b>

> ### `GET /api`
>
> serves up json representation of all the available endpoints of the api

<br>

> ### `GET /api/users`
>
> serves an array of all users
>
> Example response:  
> `{ "users": [ { "username": "butter_bridge" }, { "username": "icellusedkars" } ] }`

<br>

> ### `GET /api/topics`
>
> serves an array of all topics
>
> Example response:  
> `{ "topics": [ { "slug": "football", "description": "Footie!" } ] }`

<br>

> ### `GET /api/articles`
>
> serves an array of all articles
>
> > **Available queries:**  
> > "topic" = can be set to any existing topic  
> > "sort_by" = "created_at"(default), "votes", "comment_count"  
> > "order_by" = "DESC"(default) or "ASC"
>
> Example response:  
> `{ "articles": [ { "article_id": 1, "title": "Living in the shadow of a great man", "topic": "mitch", "author": "butter_bridge", "body": "I find this existence challenging", "created_at": 1594329060000, "votes": 100, "comment_count": "1" }, { "article_id": 2, "title": "Sony Vaio; or, The Laptop", "topic": "mitch", "author": "icellusedkars", "body": "Comment Body", "created_at": 1602828180000, "votes": 0, "comment_count": "2" } ] }`

<br>

> ### `GET /api/article/:article_id`
>
> serves a single article of given id (if id exists)
>
> Example response:  
> `{ "article": { "article_id": 1, "author": "Brynster", "title": "The Theft of Booky McBook Face", "topic": "Comedy Crime Drama", "body": "woopdy booky doo!", "created_at": 1527695953341, "votes": 420, "comment_count": "11" } }`

<br>

> ### `GET /api/article/:article_id/comments`
>
> serves an array of comments for a particular article (if id exists)
>
> Example response:  
> `{ "comments": [ { "comment_id": 396, "body": "Legendary", "article_id": 2, "author": "cooljmessy", "votes": 0, "created_at": "2022-04-06T15:27:15.888Z" }, { "comment_id": 162, "body": "Et suscipit maxime sit sunt consequuntur consequatur fugiat molestias. Et quis enim vero.", "article_id": 2, "author": "grumpy19", "votes": 14, "created_at": "2020-10-03T19:22:00.000Z" } ] }`

<br>

### <b>PATCH Endpoints</b>

> ### `PATCH /api/articles/:article_id`
>
> amends an article's votes, then serves the updated article with amended vote count
>
> Example request body:  
> `{ inc_votes: -1 }`
>
> Example response:  
> `{ "article": { "article_id": 2, "title": "The Rise Of Thinking Machines: How IBM's Watson Takes On The World", "topic": "coding", "author": "jessjelly", "body": "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.", "created_at": "2020-05-14T01:02:00.000Z", "votes": 11 } }`

<br>

### <b>DELETE Endpoints</b>

> ### `DELETE /api/comments/:comment_id`
>
> deletes comment by id (if id exists)
>
> Example response:  
> `{}` - status 204

<br>

## <b>How to clone and set up this repository</b>

### <b>Step 1:</b> Clone this GitHub repository

`'git clone https://github.com/Brynster99/nc-backend-project.git'`

### <b>Step 2:</b> Install dependencies

Install JS dependencies by running `'npm i'` within the cloned repository

You must also have PostgreSQL installed and running for following steps to succeed

### <b>Step 3:</b> Add configuration files

Create `'.env.test'` and `'.env.development'` files containing `'PGDATABASE=nc_news_test'` and `'PGDATABASE=nc_news'` respectively, <b>in the root directory</b> of this repository

### <b>Step 4:</b> Run setup scripts

- Run `'npm run setup-dbs'` to create the databases in PostgreSQL
- Run `'npm run seed'` to seed the created databases

### <b>Step 5:</b> Run tests OR Experiment with API locally

At this stage, you're able to run tests with `'npm run test'`

You can also test the API manually by running `'npm run start'` and making requests to localhost:[_port_] to whichever endpoints you wish to test
