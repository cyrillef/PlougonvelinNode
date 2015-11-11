#!/bin/bash

cd /var/lib/cloud9/PlougonvelinNode/server
sudo /usr/local/bin/forever stop ./start.js
sudo /usr/local/bin/forever start ./start.js

