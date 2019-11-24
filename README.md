# README #

This is a repository for the bidsoup project.

### What is this repository for? ###

* Bidsoup source code and configs
* Domain: [www.bidchowder.com](www.bidchowder.com)
* Github: https://github.com/mardotio/bidsoup
* Infrastructure: https://github.com/jaycle/bidsoup-infra

### How do I get set up? ###
This project uses docker to speed up getting of the ground. For that you will need docker on your local machine. https://docs.docker.com/engine/installation/

With Docker installed, you can follow these steps:

* Clone down this repository
* Run `docker-compose up` to build all the images and spin them up.
  * use the `-d` flag to run as deamon (in background)
  * use the `--build` flag if something changed which needs to be recopied into the container.
* Navigate to localhost to see the site. If not previously accomplished, will need to run migrations.


### Loading Data ###
Data can be seeded using django's fixture tools. Running `manage.py loaddata <fixture>` will place the data into the database.

If for some reason you want to start over in development with a fresh database, a command is available to drop all the tables and re-migrate. To do this, run `./manage.py updatedb --reset`.

### Deploy ###
Deployment is handled via merges to master. The script `deploy.sh` is executed off the latest master branch. `bidsoup-infra` contains the configuration and release pipeline source.

### Debugging ###
The django backend is set up with [django-ptvsd-debug](https://github.com/scottbarkman/django-ptvsd-debug). If the launched with `DEBUG=True` (the default) then the correct packages will be installed and ports exposed. The configuration settings the host side will depend on your editor. For VS Code, the following can be added to `launch.json`:

```json
  "configurations": [
    ...
    {
      "name": "Python: Remote Attach",
      "type": "python",
      "request": "attach",
      "port": 5678,
      "host": "localhost",
      "pathMappings": [
        {
          "localRoot": "${workspaceFolder}/backend/bidsoup",
          "remoteRoot": "/code/bidsoup"
        }
      ]
    },
  ]
```

To debug library code, too, add a path map from virtual environment's site-packages such as:

```json
  {
    "localRoot": "${workspaceFolder}/backend/.venv/Lib/site-packages",
    "remoteRoot": "/usr/local/lib/python3.6/site-packages"
  }
```
and set `"justMyCode": false`.


### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines
