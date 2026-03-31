const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas de préstamos requieren TOKEN (authMiddleware)
router.use(authMiddleware);

router.get('/', loanController.getAll);
router.post('/', loanController.create);
router.patch('/:id', loanController.updateStatus);

module.exports = router;
