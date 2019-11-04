# Blockmaker

A command-line interface for bootstraping your Hyperledger Fabric projects. It provides templates for developing a smart contract and a RESTful API to connect to your network.

## Installation 


```bash
npm i -g @0xkalvin/blockmaker
```


## Usage

```bash
blockmaker [template] [options]
```

### Options
    template                Which kind of project you want to build
    -l, --language          Which language to use in your project. 
                            Currently supporting only Javascript.
    -h, --help              Print this help text and exit
    --version               Print program version and exit                            

    -g, --git               Initializes a git repository.
    -y, --yes               Skip options, goes with default settings.
    -i, --install           Install project dependencies.
        

## Overview

<p align="center">
  <img src="https://raw.githubusercontent.com/0xkalvin/blockmaker/master/assets/1.png" width="350" alt="accessibility text">
</p>


<p align="center">
  <img src="https://raw.githubusercontent.com/0xkalvin/blockmaker/master/assets/2.png" width="350" alt="accessibility text">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/0xkalvin/blockmaker/master/assets/3.png" width="350" alt="accessibility text">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/0xkalvin/blockmaker/master/assets/4.png" width="350" alt="accessibility text">
</p>


                             
```

my-backend-app
├── README.md
├── package.json
├── package-lock.json
└── test
    └── unit
        └── unit.js

    └── integration
        └──  integration.js

└── src
    └── config
        ├── connectionProfileIBP.js
        └── connectionProfileLocal.js
    └── controllers
        └──  hello.js
    └── middlewares
        └──  errorHandling.js
    └── routes
        └──  health.js
    └── services
        └── blockchain.js
    ├── app.js
    └── server.js
```


## Roadmap

-   Support for others languages such as Typescript.

## License
[MIT](https://choosealicense.com/licenses/mit/)