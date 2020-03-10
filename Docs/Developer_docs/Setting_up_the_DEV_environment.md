# Setting up the development environment

1. Open a command line terminal (e.g. windows cmd or PowerShell)
2. Make sure, Node.js is installed by running `node -v`. If this command is unknown, install Node.js including the NPM package manager.
3. Go to `<path_to_workbench>/vendor/axenox/angularmaterialfacade/Facades/Angular` folder.
4. Run `npm install` to download all dependencies
5. Run `ng serve` to start the development server
7. Make sure, the configuration of the Angular Material Facade allows CORS AJAX requests from `http://localhost:4200` (see below).
6. Open `http://localhost:4200` in your browser