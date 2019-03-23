const Config = {
    mongodb:{
        url:process.env.MONGO_URL
    },
    jwt_secret:process.env.JWT_SECRET,
    facebook:{
        app_id:process.env.FACEBOOK_APP_ID,
        app_secret:process.env.FACEBOOK_APP_SECRET,
        url:process.env.CALLBACK_URL
    }
};

module.exports = Config;