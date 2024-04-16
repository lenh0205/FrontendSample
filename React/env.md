========================================================================
# Create-React-App

## Enviroment Variables Overview
* -> **`built-in environment`** variable called **NODE_ENV** 
* -> any other environment variables starting with **REACT_APP_** 
* -> any other variables will be ignored to avoid accidentally **`exposing a private key on the machine that could have the same name`**

* => useful for **`displaying information conditionally`** based on _where the project is deployed_ or _consuming sensitive data that lives outside of version control_

## WARNING
* -> **do not store any secrets** (_such as **`private API keys`**_) in our React app
* -> Environment variables are **`embedded into the build`**, meaning **anyone can view** them by inspecting our app's files

## Note
* -> to read **`NODE_ENV`** we use **`process.env.NODE_ENV`**
* -> if **npm start**, it's always equal to **development**
* -> if **npm run build**, it's always equal to **development**
* -> if **npm test**, it's always equal to **test**
* -> **cannot override NODE_ENV manually** (_prevents developers from **`accidentally deploying a slow development build`** to production_)

```js
// having access to the NODE_ENV is also useful for performing actions conditionally
// when you compile the app with npm run build, the minification step will strip out this condition, and the resulting bundle will be smaller

if (process.env.NODE_ENV !== 'production') {
  analytics.disable();
}
```

## Adding 'Development Environment Variables' In .env

### .env
* -> to **`define permanent environment variables`**, create **.env file in the root of our project**
* -> we need to **restart the development server** after **`changing .env files`**
* -> .env files **`should be checked into source control`** (_with the exclusion of .env*.local to avoid override_)

### Other .env files
* -> **.env** - **`default`**
* -> **.env.local** - **Local overrides**, this file is **`loaded for all environments except "test"`**
* -> **.env.development, .env.test, .env.production** - **`Environment-specific settings`**
* -> **.env.development.local, .env.test.local, .env.production.local** - **Local overrides** of **`environment-specific settings`**

* _ta có thể hiểu như này, files on the left have **`more priority`** than files on the right:_
* -> **`npm start`**: **.env.development.local**, **.env.local**, **.env.development**, **.env**
* -> **`npm run build`**: **.env.production.local**, **.env.local**, **.env.production**, **.env**
* -> **`npm test`**: **.env.test.local**, **.env.test**, **.env** (note **`.env.local is missing`**)

* _these variables will act as the defaults if the machine does not explicitly set them_

## Mechanism
* -> during the build, the **`process.env.REACT_APP_...`** will be replaced with the current value of the REACT_APP_... environment variable
* -> in order to consume this value, we need to **`have it defined in the environment`**
* => this can be done using two ways: either in **shell** or in a **.env file**

## Referencing 'Environment Variables' in the HTML
* the environment variables are **`injected at build time`** (_if we need to inject them at runtime, we need to use other way_)

```html - public/index.html
<title>%REACT_APP_WEBSITE_NAME%</title>
```

## Expanding Environment Variables In .env
* Expand variables already on our machine for use in our .env file (using **`dotenv-expand`**)

```shell
REACT_APP_VERSION=$npm_package_version
# REACT_APP_VERSION=${npm_package_version}

DOMAIN=www.example.com
REACT_APP_FOO=$DOMAIN/foo
REACT_APP_BAR=$DOMAIN/bar
```

## Adding 'Temporary Environment Variables' In Shell
* -> this manner is **`temporary for the life of the shell session`**

```shell
# Windows (cmd.exe)
set "REACT_APP_NOT_SECRET_CODE=abcdef" && npm start

# Windows (Powershell)
($env:REACT_APP_NOT_SECRET_CODE = "abcdef") -and (npm start)

# Linux, macOS (Bash)
REACT_APP_NOT_SECRET_CODE
```

========================================================================
# Security

## Drawbacks of a file
* .env is a file, so it's will have the drawbacks of being a file
* -> containers are based on Linux cgroups, namespaces, and other components, which means that they are also built around the concept of everything being a file
* -> everything in k8s is also a file, a YAML file. This concept makes k8s extraordinarily flexible and customizable

* => we are not supposed to store your "production" file in our repos

## Updating a secret config
* -> if we need to update a database password? Whoever updates the .env will have access to every secret in the file; 
* -> Every time a config has to be updated whoever is updating it can see EVERY secret

## Versioning
* -> we are deploying a new feature that requires updating your config / secret variables, something goes wrong and the application gets rolled back
* -> _Uh-oh does anyone remember the last values we had in the .env? We have no history and the application requires the values we just deleted/overwrote_

## Committing an .env file to public repos
* -> developers on github commits only templates of this file to help other understand the env vars used in a particular project
* -> the idea of having an .env file in a repo is to have an example or template of the required env vars as a form of documentation that tells which variables are needed for this project
* -> they could have default values (_but they should never contain plain text credentials_)

* _there is a .gitignore file (or global ~/.gitignore file) in case we want to ignore that file from being committed_

* => to share the .env file with other developers: 
* -> if we're collaborating with other people on a project, it's essential to keep our .env file private so that only invited collaborators can see it
* -> Ex: create a private repo for the .env file

## Production
* -> files are not meant for use in production and should be removed/ignored from the codebase before deploying it to production
* -> the application should then load the template .env and look for other places to override their default values depending on the current environment. 
* -> this could be a .env.local file on the system, already set system environment variables, or variables from config storage

# Solution: Config Servers
* -> A config server is an externalized application for storing configs and secrets; it's considered the central hub for managing secrets across environments
* -> Multiple cloud services can function as a config server like AWS Parameter Store, Google Secrets Manager, or HashiCorp Vault 
* -> once we create a secret or config, most of the time we are given a URL

## Storing the .env file
* With a config server, all the secrets are centralized in one place, encrypted, and can only be accessed by applications and users you approve

## Updating a secret
* With a config server, instead of updating a secret, you create a new version. After creating a new version, you update your secret URL like .../config/DB_PASSWORD/v2 or .../config/DB_PASSWORD/v3

## Versioning
* Like with solution 2, most config servers have automatic versioning. If you need to update a secret, create a new version and update the config URL in the application. If the application gets rolled back, it will automatically use the last config URL you had in place.

This way secrets are protected and your applications can get rolled back with no issues with the previous secrets.

## More Pros of a Config Server 
Automatic Secret Rotation
Secrets can become stale which can lead to your systems becoming compromised! A centralized config like AWS provides automatic Secret Rotation.

If you team or org all pull the same config, they will automatically get updated with the latest values. No need to send it over slack, no need to get a "trusted" dev, or having the possibility of forgetting to update one of your .env files. Easy and painless!

VPC Endpoints
A config server is usually hosted on a VPC which provides a localhost like connection for your services. This allows the ability to pull secrets without them ever having to touch the internet (virtually no latency), nor allowing outsiders to query the server.

Audit Logs
Did a secret get leaked? Config servers usually carry audit logs so you can check when or where a secret was accessed.

Does an updated config cause an error? Check when it was last updated and if needed, preform a global update for all your services. No plain text file editing needed.

Final Thoughts 💭
I hope now developers will start using centralized configs for their production services. .env files are unreliable and have no access management, versioning, or safe updates.

I'm not saying .env file don't have a purpose. They can be used for local or development-oriented environments.

What I'm trying to say is don't store valuable secrets in simple files, especially if my data is in your service.


========================================================================

https://appwrk.com/reactjs-environment-variables
https://viblo.asia/p/su-dung-bien-moi-truong-trong-reactjs-Qbq5Q0aLlD8
https://www.architect.io/blog/2022-08-16/react-environment-variables-developers-guide/
https://dev.to/wiseai/continue-using-env-files-as-usual-2am5
* liệu các biến trong .env có thực sự secure không

