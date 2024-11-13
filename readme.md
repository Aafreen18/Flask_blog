# Flask Blog Application

A simple blog application built with Flask, SQLAlchemy, JWT for authentication, and CORS for cross-origin resource sharing. This application provides endpoints for user registration, login, blog post creation, commenting, and liking posts.

## Features

- **User Registration**: Users can register an account with a unique username and email.
- **User Login**: Users can log in to receive a JWT token for authentication.
- **Create Blog Posts**: Authenticated users can create blog posts.
- **View Blog Posts**: Anyone can view all blog posts or a specific post by ID.
- **Update/Delete Blog Posts**: Authenticated users can update or delete their posts.
- **Comment on Blog Posts**: Authenticated users can add comments to posts.
- **Like Blog Posts**: Users can "like" a blog post.

## Getting Started

### Prerequisites

- Python 3.x
- `pip` (Python package manager)
- A PostgreSQL or MySQL database (or any SQL database supported by SQLAlchemy)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aafreen18/flask_blog.git
   cd flask_blog
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install Requirements**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=<your-database-url>
   JWT_SECRET_KEY=<your-secret-key>
   ```

5. **Initialize the Database**:
   Run the following command to create the tables:
   ```bash
   flask shell
   >>> from app import db
   >>> db.create_all()
   ```

6. **Run the Application**:
   ```bash
   python app.py
   ```

   The application will be available at `http://0.0.0.0:5000`.

### API Endpoints

#### User Routes

- **Register**: `POST /register`
  - Request: `{ "username": "<username>", "password": "<password>", "email": "<email>" }`
  - Response: `{ "message": "User registered successfully" }`

- **Login**: `POST /login`
  - Request: `{ "username": "<username>", "password": "<password>" }`
  - Response: `{ "access_token": "<JWT token>" }`

#### Blog Routes

- **Create Blog Post**: `POST /api/blogs` (JWT required)
  - Request: `{ "title": "<title>", "content": "<content>", "author": "<user_id>" }`
  - Response: `{ "message": "Blog post created" }`

- **Get All Blog Posts**: `GET /api/blogs`
  - Response: `[{ "id": <id>, "title": "<title>", "content": "<content>", "author_id": <user_id> }, ...]`

- **Get Blog by ID**: `GET /api/blogs/<int:id>`
  - Response: `{ "id": <id>, "title": "<title>", "content": "<content>", "author_id": <user_id> }`

- **Update Blog Post**: `PUT /api/blogs/<int:id>` (JWT required)
  - Request: `{ "title": "<new_title>", "content": "<new_content>" }`
  - Response: `{ "message": "Blog post updated" }`

- **Delete Blog Post**: `DELETE /api/blogs/<int:id>` (JWT required)
  - Response: `{ "message": "Blog post deleted" }`

#### Comment Routes

- **Add Comment**: `POST /api/blogs/<int:id>/comments` (JWT required)
  - Request: `{ "comment_text": "<comment_text>", "author": "<user_id>" }`
  - Response: `{ "message": "Comment added" }`

#### Like Routes

- **Like a Blog Post**: `POST /api/blogs/<int:id>/like` (JWT required)
  - Response: `{ "message": "Blog liked" }`

## Built With

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - ORM for database management
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) - JWT authentication
- [Flask-CORS](https://flask-cors.readthedocs.io/) - Cross-Origin Resource Sharing
- [dotenv](https://pypi.org/project/python-dotenv/) - For environment variable management

## License

This project is licensed under the MIT License.

## Acknowledgments

- Flask and Flask documentation for the guidance
- SQLAlchemy for seamless database integration
- Contributors and Flask community for constant support

