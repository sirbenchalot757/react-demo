# React Demo

for my precious boy

## Getting started

Clone the repo:

```bash
git clone https://github.com/blocknative/react-demo.git
```

Navigate to the project directory:

```bash
cd react-demo
```

Install the dependencies:

```bash
yarn
```

install correct node version

nvm install 14

nvm use 14

Start the development server:

```bash
yarn start
```

The project will be running on [localhost:3000](http://localhost:3000)

### SSL

Some wallets require that the website within which it runs be using a https
connection. If you are testing one of these wallets, Ledger is one, then you have
two options:

1.  Setup a valid certificate for localhost using [this guide](https://www.freecodecamp.org/news/how-to-set-up-https-locally-with-create-react-app/).
2.  Allow invalid certificates for resources loaded from localhost by navigating here within a chrome based browser: [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost)
