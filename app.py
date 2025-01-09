from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

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

    # For simplicity, assuming it's white's turn, all castling rights available,
    # no en passant, and starting move counts
    return f"{position} w KQkq - 0 1"

@app.route('/evaluate', methods=['POST'])
def evaluate_position():
    try:
        # Get board JSON from request
        board_data = request.json

        # Convert board to FEN
        fen = board_to_fen(board_data['board'])

        # Ensure baeagn is executable
        baeagn_path = "./baeagn"
        if not os.access(baeagn_path, os.X_OK):
            os.chmod(baeagn_path, 0o755)
        result1 = subprocess.run(
                ["echo", fen, ">", "jaeagn.fen"]
                )        
        # Execute baeagn with the FEN
        result = subprocess.run(
                [baeagn_path],
                capture_output=True,
                text=True,
                check=True
                )

        # Get evaluation from stdout
        evaluation = float(result.stdout.strip()) / 100.0;

        return jsonify({
            'status': 'success',
            'evaluation': 0
            })

    except subprocess.CalledProcessError as e:
        return jsonify({
            'status': 'error',
            'message': f'Engine error: {str(e)}'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Server error: {str(e)}'
            }), 500

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
