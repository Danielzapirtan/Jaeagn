#! /bin/bash

BOARD=quiw
DEPTH=16
echo $BOARD
baeagn "$(cat $BOARD.fen)" $DEPTH
true
