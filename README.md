# SMLD

Link shortener written in node.js, pretty short.

## Installation

Use git to clone this repo

```bash
git clone https://github.com/zaida04/smld.git
cd smld
npm install
npm start
```

## API Endpoints
| Endpoint | Method | Description |
| :---:         |     :---:      |          :---: |
| /create  | POST    | Create a link    |
| /:id    | GET  | Go to the link associated with this id    |
| /:id/data    | GET  | Get data associated with this id   |
| /:id | DELETE| Delete this link|

## Contributing
Pull requests are welcome.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
