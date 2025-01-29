from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import subprocess
import os
import logging
from logging.handlers import RotatingFileHandler
import chess.pgn
import chess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Constants
DEFAULT_DEPTH = 11
MIN_DEPTH = 1
MAX_DEPTH = 30
BAEAGN_PATH = os.getenv("BAEAGN_PATH", "./baeagn")

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    handlers=[RotatingFileHandler("app.log", maxBytes=10000, backupCount=3)],
    format="%(asctime)s - %(levelname)s - %(message)s",
)

def pgn_to_fen(pgn_text):
    """
    Converts PGN text to FEN string.
    """
    try:
        game = chess.pgn.read_game(pgn_text)
        if not game:
            return None, "Invalid PGN format"
        
        board = game.board()
        for move in game.mainline_moves():
            board.push(move)
        
        return board.fen(), None
    except Exception as e:
        return None, str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_position():
    try:
        data = request.json
        if not data or ('fen' not in data and 'pgn' not in data):
            return jsonify({
                'status': 'error',
                'message': 'FEN string or PGN text not provided'
            }), 400

        fen = data.get('fen')
        pgn = data.get('pgn')
        depth = data.get('depth', DEFAULT_DEPTH)

        # If PGN is provided, convert it to FEN
        if pgn:
            fen, error = pgn_to_fen(pgn)
            if error:
                return jsonify({
                    'status': 'error',
                    'message': f'Invalid PGN: {error}'
                }), 400

        # Validate depth
        try:
            depth = int(depth)
            if depth < MIN_DEPTH or depth > MAX_DEPTH:
                return jsonify({
                    'status': 'error',
                    'message': f'Depth must be between {MIN_DEPTH} and {MAX_DEPTH}'
                }), 400
        except ValueError:
            return jsonify({
                'status': 'error',
                'message': 'Invalid depth value'
            }), 400

        # Ensure baeagn is executable
        if not os.access(BAEAGN_PATH, os.X_OK):
            os.chmod(BAEAGN_PATH, 0o755)

        # Execute baeagn with the FEN and depth
        result = subprocess.run(
            [BAEAGN_PATH, fen, str(depth)],
            capture_output=True,
            text=True,
            check=True
        )

        # Get evaluation from stdout
        evaluation = result.stdout.strip().replace('\n', '<br>')
        return jsonify({
            'status': 'success',
            'evaluation': evaluation,
            'fen': fen,
            'depth': depth
        })

    except subprocess.CalledProcessError as e:
        logging.error(f"Engine error: {str(e)} - {e.stderr}")
        return jsonify({
            'status': 'error',
            'message': 'Engine error occurred'
        }), 500
    except Exception as e:
        logging.error(f"Server error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5080, debug=os.getenv("FLASK_DEBUG", "False").lower() == "true")