# README #

This is a repository for the bidsoup project.

### What is this repository for? ###

* Bidsoup source code and configs
* IP: TBD
* Domain: [www.tbd.com](www.tbd.com)
* Github: https://github.com/mardotio/bidsoup

### How do I get set up? ###
This project uses docker to speed up getting of the ground. For that you will need docker on your local machine. https://docs.docker.com/engine/installation/

With Docker installed, you can follow these steps:

* Clone down this repository
* Run `docker-compose up` to build all the images and spin them up.
  * use the `-d` flag to run as deamon (in background)
  * use the `--build` flag if something changed which needs to be recopied into the container.
* Navigate to the localhost:port to view the servers where port is:
  * 3000 for frontend
  * 8000 for django backend

The package [web-pdb](https://github.com/romanvm/python-web-pdb) is installed to assist with debugging. To use, add `import web_pdb; web_pdb.set_trace()` on a line you wish to set a breakpoing and then when it is hit, open a browser at \<IP>:5555. More documention is available on the python-web-pdb github page.

### Deploy ###
TBD

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines
