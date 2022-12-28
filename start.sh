# kill existing server and client processes by the ports they listen to
fuser -k 4001/tcp
fuser -k 80/tcp

cd /home/ubuntu/resy-bot/server
sudo npm install
nohup sudo npm run start-prod &

cd /home/ubuntu/resy-bot/client
sudo npm install
nohup sudo PORT=80 node ./node_modules/.bin/react-scripts start &