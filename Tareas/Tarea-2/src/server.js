const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // soporte PUT y DELETE

mongoose.connect('mongodb://localhost:27017/agenda_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error:', err);
});

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// route prefix
app.use("", require('./routes/routes'));

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
