const mongoose = require("mongoose");
const PORT = process.env.PORT || 2100;
require("dotenv").config();

exports.SERVER = async (url, app) => {
  try {
    const client = await mongoose.connect(url, {
      useNewUrlParser: true,
    });
    if (client) {
      app.listen(PORT, () => {
        console.log(`SERVER RUNNING ON PORT: ${PORT}`);
      });
    }
  } catch (err) {
    console.log(`OOPS SOMETHING WENT WRONG: ${err}`);
  }
};
