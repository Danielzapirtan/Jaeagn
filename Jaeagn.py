import streamlit as st
import subprocess

# Title of the app
st.title("Chess Position Analyzer")

# Input options for FEN or PGN
input_type = st.radio("Input type", ["FEN", "PGN"])

# Text area for user input
if input_type == "FEN":
    user_input = st.text_area("Enter FEN string", value="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
else:
    user_input = st.text_area("Enter PGN text", value="1. e4 e5 2. Nf3 Nc6 3. Bb5")

# Button to start analysis
if st.button("Analyze Position"):
    if user_input:
        # Prepare the command for the baeagn engine
        if input_type == "FEN":
            command = ["./baeagn", user_input, "11"]
        else:
            # Convert PGN to FEN (using python-chess)
            import chess.pgn
            import chess

            pgn = chess.pgn.read_game(chess.pgn.StringIO(user_input))
            board = pgn.board()
            for move in pgn.mainline_moves():
                board.push(move)
            fen = board.fen()
            command = ["./baeagn", fen, "11"]

        # Start the baeagn engine process
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        # Wait for the process to finish and capture the output
        stdout, stderr = process.communicate()

        # Display the engine's output
        st.write("Engine Output:")
        st.code(stdout)

        # Display errors (if any)
        if stderr:
            st.write("Errors:")
            st.code(stderr)
    else:
        st.write("Please enter a valid FEN string or PGN text.")