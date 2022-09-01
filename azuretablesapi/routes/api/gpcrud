const express = require('express');
const router = express.Router();
const gpcrudController = require('../../controllers/gpcrudController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// router.route('/')
//     .get(employeesController.getAllEmployees)
//     .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
//     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
//     .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route('/fetchdata/l1')
    .post(gpcrudController.fetchDatalevel1);

router.route('/fetchdata/l2')
    .post(gpcrudController.fetchDatalevel2);

router.route('/insertdata')
    .post(gpcrudController.insertData);

router.route('/updatedata')
    .post(gpcrudController.updateData);

router.route('/deletedata')
    .post(gpcrudController.deleteData);

module.exports = router;