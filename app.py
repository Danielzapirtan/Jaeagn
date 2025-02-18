import gradio as gr
import subprocess
import os
import chess.pgn
import chess
from io import StringIO

# Constants
DEFAULT_DEPTH = 11
MIN_DEPTH = 1
MAX_DEPTH = 30
BAEAGN_PATH = os.getenv("BAEAGN_PATH", "./baeagn")

def pgn_to_fen(pgn_text):
    """
    Converts PGN text to FEN string.
    """
    try:
        # Create a StringIO object from the PGN text
        pgn_io = StringIO(pgn_text)
        game = chess.pgn.read_game(pgn_io)
        if not game:
            return None, "Invalid PGN format"
        
        board = game.board()
        for move in game.mainline_moves():
            board.push(move)
        
        return board.fen(), None
    except Exception as e:
        return None, str(e)

def analyze_position(fen=None, pgn=None, depth=DEFAULT_DEPTH):
    try:
        if not fen and not pgn:
            return "FEN string or PGN text not provided"

        # If PGN is provided, convert it to FEN
        if pgn:
            fen, error = pgn_to_fen(pgn)
            if error:
                return f"Invalid PGN: {error}"

        # Validate depth
        try:
            depth = int(depth)
            if depth < MIN_DEPTH or depth > MAX_DEPTH:
                return f"Depth must be between {MIN_DEPTH} and {MAX_DEPTH}"
        except ValueError:
            return "Invalid depth value"

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
        return evaluation

    except subprocess.CalledProcessError as e:
        return f"Engine error: {str(e)} - {e.stderr}"
    except Exception as e:
        return f"Server error: {str(e)}"

# Gradio Interface
iface = gr.Interface(
    fn=analyze_position,
    inputs=[
        gr.Textbox(label="FEN String (optional)", placeholder="Enter FEN string here..."),
        gr.Textbox(label="PGN Text (optional)", placeholder="Enter PGN text here..."),
        gr.Slider(minimum=MIN_DEPTH, maximum=MAX_DEPTH, value=DEFAULT_DEPTH, label="Depth")
    ],
    outputs=gr.HTML(label="Evaluation"),
    title="Chess Position Analyzer",
    description="Analyze a chess position using the baeagn engine. Provide either a FEN string or PGN text."
)

if __name__ == "__main__":
    iface.launch(server_port=5080)