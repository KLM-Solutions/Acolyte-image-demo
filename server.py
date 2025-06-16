from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from google import genai
from google.genai import types
import os
from werkzeug.utils import secure_filename
import uuid
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS to allow requests from Next.js app
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Configure Google AI client
GOOGLE_API_KEY = ""
try:
    client = genai.Client(api_key=GOOGLE_API_KEY)
    logger.info("Successfully initialized Google AI client")
except Exception as e:
    logger.error(f"Failed to initialize Google AI client: {str(e)}")
    raise

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/generate-video', methods=['POST', 'OPTIONS'])
def generate_video():
    # Handle preflight request
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    try:
        # Get the prompt from form data
        prompt = request.form.get('prompt')
        if not prompt:
            logger.warning("No prompt provided in request")
            return jsonify({
                'success': False,
                'error': 'No prompt provided'
            }), 400
        
        logger.info(f"Received prompt: {prompt}")
        
        # Handle image upload if present
        image_data = None
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                logger.info(f"Saved uploaded image to: {filepath}")
                # Read the image file
                with open(filepath, 'rb') as img_file:
                    image_data = img_file.read()
            else:
                logger.warning(f"Invalid file type uploaded: {file.filename if file else 'None'}")

        try:
            # Initialize video generation operation
            config = types.GenerateVideosConfig(
                number_of_videos=1,
                fps=24,
                duration_seconds=5,
                enhance_prompt=True,
                aspect_ratio="16:9"
            )

            if image_data:
                logger.info("Starting video generation with image")
                operation = client.models.generate_videos(
                    model="veo-3.0-generate-preview",
                    prompt=prompt,
                    image=types.Image(
                        data=image_data,
                        mime_type="image/jpeg"
                    ),
                    config=config
                )
            else:
                logger.info("Starting video generation without image")
                operation = client.models.generate_videos(
                    model="veo-3.0-generate-preview",
                    prompt=prompt,
                    config=config
                )

            # Wait for operation to complete
            logger.info("Waiting for video generation to complete...")
            while not operation.done:
                time.sleep(20)  # Increased sleep time to 20 seconds as per example
                operation = client.operations.get(operation)
                logger.debug("Checking operation status...")

            if operation.response:
                logger.info("Video generation completed successfully")
                video = operation.result.generated_videos[0].video
                return jsonify({
                    'success': True,
                    'response': video.uri
                })
            else:
                logger.error("Video generation failed - no response from operation")
                return jsonify({
                    'success': False,
                    'error': 'Generation failed - no response from operation'
                }), 500

        except Exception as e:
            logger.error(f"Error during video generation: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'Video generation error: {str(e)}'
            }), 500

    except Exception as e:
        logger.error(f"Unexpected error in generate_video endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True) 