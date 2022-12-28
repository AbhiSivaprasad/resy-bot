# kill existing server and client processes by the ports they listen to
fuser -k 4001/tcp
fuser -k 80/tcp

cd /home/ubuntu/resy-bot/client
sudo npm install
npm run build

cd /home/ubuntu/resy-bot/server
sudo npm install
nohup sudo npm run start-prod &