const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const sequelize = require("./config/config");

app.use(cors());
app.use(express.json());
//app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;
const IP_ADDRESS = "192.168.1.18";
app.use("/", require("./routes/userRoute.js"));
app.use("/", require("./routes/customerRoute.js"));
app.use("/", require("./routes/riderRoute.js"));
app.use("/", require("./routes/storeOwner.js"));
app.use('/api/search/:text', async (req,res)=>{
  const{text}=req.params
  console.log(text)
  const endpoint=`https://api.locationiq.com/v1/autocomplete?key=pk.14360aabcdc3ab0ce852ee2c18d9df59&q=${text}&limit=37dedupe=1`
  const response= await fetch(endpoint)
  const data=await response.json();
  res.send(data);
})

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Serverr is running at http://${IP_ADDRESS}:${PORT}`);
});
