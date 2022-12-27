# kill existing server and client processes by the ports they listen to
fuser -k 4001/tcp
fuser -k 3000/tcp

cd ~/server
sudo npm install
sudo npm run start-prod &

cd ~/client
sudo npm install
sudo npm run start-prod &