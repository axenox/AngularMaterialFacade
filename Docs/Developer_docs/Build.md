# Build

When developing and testing via `ng serve`, the source files are compiled on-the fly, so all changes are almost instantly effective on the dev-server `http://localhost:4200/`. However, these changes do not effect the result of the facade renderer - i.e. what you get when navigating to a page using the angular facade on the workbench. The facade renderer uses the production build of the angular app, that is part of the app's package.

## Production build

After successfully testing changes to the Angular app, you need to run a production build to apply your changes to the facade:

```
ng build --prod --baseHref=/exface/exface/vendor/axenox/angularmaterialfacade/Facades/Angular/dist/
```

**NOTE:** adjust the value of the `--baseHref` according to your workbench installation folder. This path is specific to your installation, but will be automatically changed when the facade app is installed on another machine.

The facade-build uses the default production environment `environment.prod.ts`.

## Updating dependencies

If you want to update dependencies, run `npm update` before the build. This will ensure your build has the latest versions of 3d-party libraries.