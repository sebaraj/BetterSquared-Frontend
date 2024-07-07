# BetterSquared Frontend

This is the front-end, client application for [BetterSquared](https://github.com/sebaraj/BetterSquared), a group-based, simulated sports betting app. Written in Typescript, utilizing React, TailwindCSS, and Vite. 

## Setup

### Certificate

To set up the certificate for the client application:

- Modify `/etc/hosts` file to map `127.0.0.1` to `bettersquared.com`
- Generate the SSL/TLS certificate: `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout bettersquared.key -out bettersquared.crt -subj "/CN=bettersquared.com"`
- Run `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain bettersquared.crt`
- Add the certificate to your browser's trusted certificates by going to chrome://settings/security and under "Manage certificates", import bettersquared.crt and trust it.

### Installation

- Clone the repository: `git clone https://github.com/sebaraj/BetterSquared-frontend`
- In the root directory of this project:
  - Install the dependencies: `npm install`
  - Run the development server: `npm run dev`
- Start the backend, [BetterSquared](https://github.com/sebaraj/BetterSquared)

## Access

The application can be accessed at: [https://bettersquared.com:8080/](https://bettersquared.com:8080/). 

### Dependencies

- `@headlessui/react`
- `@types/react-router-dom`
- `axios`
- `fs`
- `headlessui`
- `prop-types`
- `react`
- `react-confirm-alert`
- `react-dom`
- `react-router-dom`
- `vite-plugin-proxy`

