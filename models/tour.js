var mongoose = require("mongoose");

var tourSchema = new mongoose.Schema({
    fecha: String,
    estado: String,
    municipio: String,
    titulo: String,
    precio: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Temazcal", tourSchema);