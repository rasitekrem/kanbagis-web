//ilanlar burada olacak
const   mongoose = require("mongoose");


const IlanSchema = new mongoose.Schema({
  mail        : {type: String, required: 'Cannot be empty'},
  username    : {type: String, required: 'Cannot be empty'},
  phoneNumber : {type: String, required: 'Cannot be empty'},
  nameSurname : {type: String, required: 'Cannot be empty'},
  kanGrubu    : {type: String, required: 'Cannot be empty'},
  ilce        : {type: String, required: 'Cannot be empty'},
  il          : {type: String, required: 'Cannot be empty'},
  aciklama    : String
});


module.exports = mongoose.model("Ilan", IlanSchema);
