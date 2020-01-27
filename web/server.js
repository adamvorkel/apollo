const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
    console.log(`Apollo UI listening on port ${port}`);
});

return app;
