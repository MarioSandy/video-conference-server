const allowedOrigins = require("./allowedOrigins");

const corsOption = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Set-Cookie", "Authorization"],
  methods: "GET,PUT,PATCH,POST,DELETE",
  optionSuccessStatus: 200,
  credentials: "include",
};

const ioCorsOption = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET, POST"],
};

module.exports = { corsOption, ioCorsOption };
