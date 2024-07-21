npm install
npm run serve:local:clean:background
sleep 20 # Temporary fix to wait for database to be healthy - postgis extension means typical healthcheck is more complicated
npm run db:reset:local
CURRYCOMPARE_ENVIRONMENT=local npm run test:integration

