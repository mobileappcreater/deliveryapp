exports.domain = "https://shop.symbrobusinesssolutions.com/api/v2";
exports.APP_SECRET="app_secret"; //Your app secret - same as in the .env file in your web project 
exports.APP_NAME="Bollywood Delivery";
exports.LOGO="https://shop.symbrobusinesssolutions.com/uploads/settings/d59fe542-3cfc-461b-b6b2-7a6392326639_logo.jpg";

exports.SINGLE_MODE=true;
exports.SINGLE_MODE_ID=16;
exports.SINGLE_MODE_NAME="RESTORAN BOLLYWOOD MAJU ENT";

exports.MULTI_CITY=true;


//Currency
exports.currency="MYR";
exports.currencySign="RM";

//COD setup
exports.enableCOD=true;  //Cash on deliver

//Stripe settup
exports.enableStripe=true; 
exports.stripePublishKey="";

//Other payment gateways
exports.enablePayPal=true; 
exports.enableMollie=true; 
exports.enablePayStack=true; 

//Date format
exports.dateTimeFormat="MMMM Do YYYY, h:mm a";
exports.dateFormat="MMMM Do YYYY";

//OneSignal APP KEY
exports.ONESIGNAL_APP_ID="BOLLYWOOD";

//Google setup
exports.GOOGLE_API_KEY="AIzaSyC5fxkzFG06ILnfh-OI4MUZw_kDj_iBw8M";
exports.queryTypes="malaysia"
exports.queryCountries=['my']; //{['pl', 'fr','us']}


/*
    searchRadius={500}
    searchLatitude={51.905070}
    searchLongitude={19.458834}
*/
exports.searchLatitude=null;
exports.searchLongitude=null;
exports.searchRadius=null;