const express = require('express');
const app = express();
const searchRouter = require("./routes/searchRouter.js");
const {searchVideos} = require("./controllers/searchControllers.js")

app.use(express.json());

app.use("/search", searchRouter);

app.get("/search", searchVideos)

const port = 4000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})