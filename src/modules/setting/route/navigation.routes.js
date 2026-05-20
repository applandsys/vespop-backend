// src/routes/navigation.routes.js
const express = require('express');
const router = express.Router();
const navigationController = require('../controller/NavigationController');

// CRUD
router.post('/', navigationController.createNavigation);
router.get('/', navigationController.getAllNavigationTree); // frontend tree
router.get('/:id', navigationController.getNavigationById);
router.put('/:id', navigationController.updateNavigation);
router.delete('/:id', navigationController.deleteNavigation);

module.exports = router;

// GET /api/navigation?position=header