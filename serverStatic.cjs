const { join, resolve } = require('path');
const express = require('express');
const app = express();

app.use(express.static(join(__dirname, 'dist')));

const PORT = 3000;

app.get('*', (req, res) => {
	res.sendFile(resolve(__dirname, 'dist/index.html'))
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
