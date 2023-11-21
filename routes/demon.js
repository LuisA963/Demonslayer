const express = require('express');
const router = express.Router();
const { listDemon, listdemonByID, addDemon, updateDemon, deleteDemon, signInUser }= require('../controllers/demon');

router.get('/', listDemon); 
router.get('/:id', listdemonByID); 
router.post('/', signInUser); 
router.put('/', addDemon); 
router.patch('/:id', updateDemon);
router.delete('/:id', deleteDemon);

module.exports = router;

// http://localhost:3000/api/v1/demon