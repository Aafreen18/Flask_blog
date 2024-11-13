from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from datetime import datetime
import os
from dotenv import load_dotenv


load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(username=data['username'], password=data['password'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

# Login to get JWT
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        token = create_access_token(identity=user.id)
        return jsonify(access_token=token)
    return jsonify({"message": "Invalid credentials"}), 401

# Create Blog Post
@app.route('/api/blogs', methods=['POST'])
@jwt_required()
def create_blog():
    data = request.get_json()
    new_blog = BlogPost(title=data['title'], content=data['content'], author_id=data['author'])
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({"message": "Blog post created"}), 201

# Get All Blog Posts
@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    blogs = BlogPost.query.all()
    return jsonify([{"id": blog.id, "title": blog.title, "content": blog.content, "author_id": blog.author_id} for blog in blogs])

# Get Blog by ID
@app.route('/api/blogs/<int:id>', methods=['GET'])
def get_blog(id):
    blog = BlogPost.query.get_or_404(id)
    return jsonify({"id": blog.id, "title": blog.title, "content": blog.content, "author_id": blog.author_id})

# Update Blog Post
@app.route('/api/blogs/<int:id>', methods=['PUT'])
@jwt_required()
def update_blog(id):
    data = request.get_json()
    blog = BlogPost.query.get_or_404(id)
    blog.title = data['title']
    blog.content = data['content']
    db.session.commit()
    return jsonify({"message": "Blog post updated"})

# Delete Blog Post
@app.route('/api/blogs/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_blog(id):
    blog = BlogPost.query.get_or_404(id)
    db.session.delete(blog)
    db.session.commit()
    return jsonify({"message": "Blog post deleted"})

# Add Comment to a Blog Post
@app.route('/api/blogs/<int:id>/comments', methods=['POST'])
@jwt_required()
def add_comment(id):
    data = request.get_json()
    new_comment = Comment(blog_id=id, comment_text=data['comment_text'], author_id=data['author'])
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added"}), 201

# Like a Blog Post
@app.route('/api/blogs/<int:id>/like', methods=['POST'])
@jwt_required()
def like_blog(id):
    # Like functionality can be implemented here, assuming you want to store likes.
    return jsonify({"message": "Blog liked"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True, host="0.0.0.0")
