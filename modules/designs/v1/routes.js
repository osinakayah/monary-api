const express = require('express');
const v1Designs = express.Router();
const DesignController = require('./controllers/designsController');
v1Designs.get('/', DesignController.indexDesign);
v1Designs.post('/', DesignController.storeDesign);
v1Designs.put('/', DesignController.indexDesign);
v1Designs.delete('/:design', DesignController.indexDesign);
module.exports = v1Designs;
