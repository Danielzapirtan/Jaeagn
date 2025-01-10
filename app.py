from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        depth = data.get('depth', 20)  # Default depth of 20 if not specified
        
        # Validate depth
        try:
            depth = int(depth)
            if depth < 1 or depth > 30:
                return jsonify({
                    'status': 'error',
                    'message': 'Depth must be between 1 and 30'
                }), 400
        except ValueError:
            return jsonify({
                'status': 'error',
                'message': 'Invalid depth value'
            }), 400

        # Ensure baeagn is executable
        baeagn_path = "./baeagn"
        if not os.access(baeagn_path, os.X_OK):
            os.chmod(baeagn_path, 0o755)

        # Execute baeagn with the FEN and depth
        result = subprocess.run(
            [baeagn_path, fen, str(depth)],  # Added depth parameter
            capture_output=True,
            text=True,
            check=True
        )

        # Get evaluation from stdout
        evaluation = result.stdout.strip()

        return jsonify({
            'status': 'success',
            'evaluation': evaluation,
            'fen': fen,
            'depth': depth
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