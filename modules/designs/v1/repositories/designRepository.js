const User = require('./../../../authentication/v1/models');
const Design = require('../models/DesignModel');

const DesignRepository = function () {
    const getAuthUserDesigns = function (authUser) {
        Design.find()
    };
    const getUnauthenticatedUserDesigns = function () {

    };
    return {
        getDesigns: function (authUser = null) {
            if (authUser) {

            }
        },
        storeDesigns: function (imageName, url, tagIds) {

        }
    }
}();
module.exports = DesignRepository;
