
express = require('express');
const app = express();
const port = process.env.PORT || 3500
app.get('/', (req, res) => {
    res.status(200).send(`<h2>Hello There is light ${process.env.NODE_ENV}<h2>`)
});

app.listen(port, () => console.log(`Version ${process.env.NODE_ENV} listening on port ${port}`));
