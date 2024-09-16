# main.py (Main Flask Application)

from flask import Flask
from flask_cors import CORS
from chatbot import chatbot_bp    # Import the chatbot blueprint
from validation import validation_bp  # Import the validation blueprint

# Initialize the main Flask application
app = Flask(__name__)

# Enable CORS for cross-origin requests (optional but recommended)
CORS(app)

# Register the blueprints to separate routes
app.register_blueprint(chatbot_bp, url_prefix='/api')  # All chatbot routes start with /api/chat
app.register_blueprint(validation_bp, url_prefix='/api')  # All validation routes start with /api/validate-documents

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
