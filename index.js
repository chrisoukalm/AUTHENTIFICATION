//imports
var express = require('express');

//variables globales
const port = '3000'


//creer l'instance
var express = express();


//lancement du serveur
express.listen(3000,()=>{
    console.log(`En écoute sur le port:${port}`);
})