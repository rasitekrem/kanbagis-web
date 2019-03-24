const   mongoose              = require("mongoose");


const UserSchema = new mongoose.Schema({
  mail        : {type: String, required: 'Cannot be empty'},
  phoneNumber : {type: String, required: 'Cannot be empty'},
  nameSurname : {type: String, required: 'Cannot be empty'},
  kanGrubu    : {type: String, required: 'Cannot be empty'},
  adres       : {type: String, required: 'Cannot be empty'},
  ilce        : {type: String, required: 'Cannot be empty'},
  il          : {type: String, required: 'Cannot be empty'},
  visibility  : {type: String, required: 'Cannot be empty'},
});


module.exports = mongoose.model("UserInfo", UserSchema);
