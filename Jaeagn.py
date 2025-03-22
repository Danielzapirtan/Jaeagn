import streamlit as st
import subprocess
import threading
import queue

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
            command = ["./baeagn", user_input, "depth"]
        else:
            # Convert PGN to FEN (you may need a library like python-chess for this)
            import chess.pgn
            import chess

            pgn = chess.pgn.read_game(chess.pgn.StringIO(user_input))
            board = pgn.board()
            for move in pgn.mainline_moves():
                board.push(move)
            fen = board.fen()
            command = ["./baeagn", fen, 64]

        # Create a queue to capture the engine's stdout
        output_queue = queue.Queue()

        # Function to read the engine's stdout in real-time
        def capture_output(process, queue):
            for line in iter(process.stdout.readline, b''):
                queue.put(line.decode("utf-8").strip())
            process.stdout.close()

        # Start the baeagn engine process
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=1, universal_newlines=True)

        # Start a thread to capture the engine's output
        output_thread = threading.Thread(target=capture_output, args=(process, output_queue))
        output_thread.daemon = True
        output_thread.start()

        # Display the engine's output in real-time
        st.write("Engine Output:")
        output_placeholder = st.empty()
        while process.poll() is None or not output_queue.empty():
            try:
                line = output_queue.get_nowait()
                output_placeholder.text(line)
            except queue.Empty:
                pass
    else:
        st.write("Please enter a valid FEN string or PGN text.")