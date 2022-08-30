const app = express();
const port = process.env.PORT || 3500
app.get('/', (req,res)  => {
    res.sendStatus(200).send("<h2>Hello there<h2")
});

app.listen(port,() => console.log(`listening on port ${port}`));
