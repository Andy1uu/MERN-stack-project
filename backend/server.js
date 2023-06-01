const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3240

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

app.all("*", (request, response) => {
  response.status(404);
  if(request.accepts('html')) {
    response.sendFile(path.join(__dirname,"public", "static", "404.html"))
  }else if(request.accepts("json")){
    response.json({message: "404 Not Found"});
  } else {
    response.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
