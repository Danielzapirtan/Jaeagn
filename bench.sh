#! /bin/bash

baeagn "$(cat jaeagn.fen)" 253 & pid=$!
sleep 259200
pkill -term baeagn

