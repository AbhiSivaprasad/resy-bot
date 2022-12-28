# kill existing server process by the port it listens to
fuser -k 4001/tcp

cd /home/ubuntu/app/client
sudo npm install
npm run build

cd /home/ubuntu/app/server
sudo npm install
nohup sudo npm run start-prod &