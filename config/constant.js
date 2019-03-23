const Config = {
    mongodb:{
        url:process.env.MONGO_URL
    },
    jwt_secret:process.env.JWT_SECRET,
    google:{
        app_id:process.env.GOOGLE_CLIENT_ID,
        app_secret: process.env.GOOGLE_SECRET,
        url:process.env.GOOGLE_CALLBACK
    },
    facebook:{
        app_id:process.env.FACEBOOK_APP_ID,
        app_secret:process.env.FACEBOOK_APP_SECRET,
        url:process.env.CALLBACK_URL
    }
};

module.exports = Config;