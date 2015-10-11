#!/bin/bash

# on Ubuntu, do not forget
# sudo ln -s /usr/bin/nodejs /usr/local/bin/node

# on aws, open port 80
# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
# or make sure to use sudo command

# cd /home/ubuntu/extract
# npm install

# /usr/local/bin/forever -> /usr/local/lib/node_modules/forever/bin/forever

cd /var/lib/cloud9/PlougonvelinNode/server
sudo /usr/local/bin/forever stop ./start.js
sudo /usr/local/bin/forever start ./start.js
