# Windows Batch script
# This should be placed in the parent directory of the kiosk application repository
# Double-click this file to ensure the server is running and preview the application in Google Chrome

# before running the server, kill any existing processes that are using port 3000
taskkill /F /IM node.exe

cd ./tpt-skillsville-kiosk
npm run serve

# wait 5 seconds and notify the user that the server is running
echo "Server is running. Launching Google Chrome in 5 seconds..."
timeout /t 5

# launch Google Chrome on Windows and navigate to http://localhost:3000/en-US/skillsville/
start chrome http://localhost:3000/en-US/skillsville/
