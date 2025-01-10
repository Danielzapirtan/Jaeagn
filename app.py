from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze', methods=['POST'])
def analyze_position():
    def monitor_file(filename, interval=15):
        last_modified = os.path.getmtime(filename)

        while True:
            time.sleep(interval)
            current_modified = os.path.getmtime(filename)

            if current_modified > last_modified:
                # print(f"{filename} has been modified.")
                # Option 1: Print the entire file
                with open(filename, 'r') as f:
                    evaluation = f.read()
                    return jsonify({
                        'status': 'success',
                        'evaluation': evaluation,
                        'fen': fen,
                        'depth': depth
                    })

    try:
        data = request.json
        if not data or 'fen' not in data:
            return jsonify({
                'status': 'error',
                'message': 'FEN string not provided'
            }), 400

        fen = data['fen']
        depth = data.get('depth', 10)  # Default depth of 10 if not specified

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
            [baeagn_path, fen, str(depth)],  # Removed `|`, added depth parameter
            capture_output=True,
            text=True,
            check=True
        )

        return monitor_file("jaeagn.anl")

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
