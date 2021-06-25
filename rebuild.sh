#!/bin/sh
echo "Rebuilding"
echo "Pulling git"
git pull
echo "Building"
cd code
npm run-script build
cd ..
echo "Restarting application"
pm2 restart love-docs-bot
echo "Done"
