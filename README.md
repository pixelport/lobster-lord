
![Screenshot LobsterLord](https://github.com/pixelport/lobster-lord/blob/master/docs/logo_sm.png?raw=true)
-----------------

LobsterLord is a Redis GUI Client. This release is still an alpha.

![Screenshot LobsterLord](https://github.com/pixelport/lobster-lord/blob/master/docs/screen.png?raw=true)

## Features

 - ability to favourite keys
 - supports large Redis Databases
 - fast inline edit of strings, lists, hashmaps, sets and sorted sets
 - Redis-CLI with autocomplete feature
 - support for multiple connections
 - tree view of keys
 - linked key feature

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install LobsterLord.

```bash
npm install -g lobster-lord
lobster-lord
```
The default port is 6487 and can be set with via the `PORT` environment variable.

## Development

Run `npm start-frontend-dev` and `npm watch`. The React frontend is in the `/client` directory. Navigate to [127.0.0.1:3000](http://127.0.0.1:3000).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[Apache License Version 2.0](LICENSE.md)
