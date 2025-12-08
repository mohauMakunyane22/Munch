const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

//middleware
app.use(cors());
app.use(express.json());

//listening to the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
