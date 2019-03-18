const Config = {
    mongodb:{
        url:process.env.MONGO_URL
    },
    jwt_secret:process.env.JWT_SECRET
};

module.exports = Config;