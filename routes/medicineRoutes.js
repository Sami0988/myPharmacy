const express = require('express');
const router = express.Router();
const {
  addMedicine,
  getAllMedicines,
getTotalMedicineCount,
getTodaysRegisteredMedicinesCount,
getSoonExpiringMedicinesCount,
updateMedicine,
deleteMedicine,
updateSupplier
} = require('../controllers/medicineController');

router.post('/add', addMedicine);
router.get('/get', getAllMedicines);
router.get('/getTotalMedicineCount',getTotalMedicineCount);
router.get('/today/count',getTodaysRegisteredMedicinesCount);
router.get('/expiring-soon/count',getSoonExpiringMedicinesCount);
router.put('/updateMedicine/:id',updateMedicine);
router.delete('/deleteMedicine/:id', deleteMedicine);
router.put('/orders/:id', updateSupplier);

module.exports = router;
