#! /bin/bash

baeagn "$(cat jaeagn.fen)" 253 & pid=$!
sleep 21600
pkill -term baeagn

