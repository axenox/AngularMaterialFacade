# Working with an Angular IDE

You can work on the facade's Angular app using your favorite IDE - totally independent from your PHP development environment (or even without one). 

## Option 1: use the facade's installation folder directly

If you change the angular code right inside the facades's installation folder, you will have all changes (PHP and Angular) in one place. Use this approach, if you are planning to use the same IDE for angular and PHP - otherwise you would have to switch IDEs permanently since both would "see" all changes.

## Option 2: use a separate folder for Angular development

If you like different IDEs for angular and PHP development, proceed as follows:

1. Setup a separate workspace in your Angular IDE
2. Clone the facade's git repo there independently of the facade. 
3. Make sure, the facade URL in the [configuration of the Angular app](../Facade_configuration.md) points to your facade
4. Open the facade configuration file `Config/axenox.AnguarMaterialFacade.config.json`
   - Check that `FACADE.AJAX.ACCESS_CONTROL_HEADERS` in `Config/axenox.AnguarMaterialFacade.config.json` allows AJAX-access to the facade from the URL of your angular dev-server.
   - Change `ANGULAR.INTERFACES.WIDGETS.PATH` and `ANGULAR.INTERFACES.ACTIONS.PATH` to point to the corresponding interface folders within your Angular workspace. The pathes **must** be relative to the facade's installation folder, so use `../../` to get out of the workbench folders.
5. Start the Angular dev-server (`ng serve`) from the Angular workspace. 

Now you can develop the Angular and PHP totally independently.

Since you've told the facade to look for Angular interfaces in your separate workspace, any changes there will automatically have effect on the facade's logic.

### Known issues with IDEs

#### WebStorm and other IntelliJ-based IDE's

Should AJAX-requests from the Angular app fail with `Access to XMLHttpRequest at 'http://...' from origin 'http://localhost:4200' has been blocked by CORS policy: Request header field x-ijt is not allowed by Access-Control-Allow-Headers in preflight response.` or similar, disable `Allow unsigned requests` in the configuration of the IDE as described [here](https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000715304-Problem-with-Chrome-plugin-and-CORS).