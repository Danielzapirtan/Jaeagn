#! /bin/bash

BOARD=$1
DEPTH=$2
echo $BOARD $DEPTH
baeagn "$(cat $BOARD.fen)" $DEPTH | tee $BOARD.d$DEPTH.anl
true
