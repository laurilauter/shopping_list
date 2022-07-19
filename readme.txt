This is a simple shopping list app with Node express backend and MongoDB.


1. Add a separate package.json to FE and backend // added one for both
2. Configure tsconfig.json correctly to output all to dist  // done, and added proper build script - public folder copies also ts file, thats bad
3. check if express needs to be configured to serve static files
4. Reconfigure .env and Heroku CLI
5. deploy FE and BE to the same Heroku app, but with two stage build if necessary.. see links
6. Fix cors locally, globallt it should be fine