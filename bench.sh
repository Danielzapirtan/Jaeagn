#! /bin/bash

baeagn "$(cat jaeagn.fen)" 253 & pid=$!
sleep 300
pkill -term baeagn

