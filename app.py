from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def board_to_fen(board_json):
    """
    Convert JSON board representation to FEN string.
    board_json should be a 2D array with pieces represented as strings:
    'K' for white king, 'k' for black king, etc.
    Empty squares are represented as None or ''
    """
    fen_parts = []
    empty_count = 0

    # Process each rank from 8 to 1 (top to bottom)
    for rank in board_json:
        rank_fen = ''
        empty_count = 0

        for square in rank:
            if not square:  # Empty square
                empty_count += 1
            else:
                if empty_count > 0:
                    rank_fen += str(empty_count)
                    empty_count = 0
                rank_fen += square

        if empty_count > 0:
            rank_fen += str(empty_count)

        fen_parts.append(rank_fen)

    # Join ranks with '/'
    position = '/'.join(fen_parts)

    # Add default values for other FEN components
    return f"{position} w KQkq - 0 1"  # Added complete FEN string format

@app.route('/analyze', methods=['POST'])
def analyze_position():
    try:
        data = request.json
        if not data or 'fen' not in data:
            return jsonify({
                'status': 'error',
                'message': 'FEN string not provided'
            }), 400

        fen = data['fen']

        # Ensure baeagn is executable
        baeagn_path = "./baeagn"
        if not os.access(baeagn_path, os.X_OK):
            os.chmod(baeagn_path, 0o755)

        # Execute baeagn with the FEN
        result = subprocess.run(
            [baeagn_path, fen],  # Fixed list format for command and arguments
            capture_output=True,
            text=True,
            check=True
        )

        # Get evaluation from stdout
        evaluation = float(result.stdout.strip())

        return jsonify({
            'status': 'success',
            'evaluation': evaluation,
            'fen': fen
        })

    except subprocess.CalledProcessError as e:
        return jsonify({
            'status': 'error',
            'message': f'Engine error: {str(e)}',
            'stderr': e.stderr
        }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)