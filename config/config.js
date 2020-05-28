process.env.PORT = process.env.PORT || 3000;


let urlDB = "";
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://enigmaUSER:Q$%P7fC#cQWH63p@192.168.1.46:60425/EnigmaDB?authSource=admin";
} else {
    urlDB = "mongodb://enigmaUSER:Q$%P7fC#cQWH63p@127.0.0.1:60425/EnigmaDB?authSource=admin"
};

process.env.URLDB = urlDB;

process.env.secretKey = "432424-23213123-123123-123231"

process.env.expireToken = '5';//Days

process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION ||  'este-es-el-seed-desarrollo';
