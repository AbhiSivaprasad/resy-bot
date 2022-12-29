# kill existing server process by the port it listens to
sudo fuser -k 4001/tcp

cd /home/ubuntu/app/client
sudo npm install
npm run build

cd /home/ubuntu/app/server
sudo npm install
sudo npm run start-prod > /dev/null 2> /dev/null < /dev/null &