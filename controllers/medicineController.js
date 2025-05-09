const Medicine = require('../models/Medicine');
const moment = require('moment');


exports.addMedicine = async (req, res) => {
  try {
    console.log("new data",req.body);
    const newMedicine = new Medicine(req.body);
    const saved = await newMedicine.save();
    res.status(201).json({
      success: true,
      message: 'Medicine added successfully.',
      data: saved
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to add medicine.',
      error: err.message
    });
  }
};


exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json({
      success: true,
      message: 'Medicines fetched successfully.',
      data: medicines
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicines.',
      error: err.message
    });
  }
};


exports.getTotalMedicineCount = async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    res.status(200).json({ total: totalMedicines });
  } catch (error) {
    console.error('Error fetching total medicine count:', error);
    res.status(500).json({ message: 'Failed to fetch total medicine count' });
  }
};

exports.getTodaysRegisteredMedicinesCount = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todaysMedicinesCount = await Medicine.countDocuments({
      createdAt: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    });
    res.status(200).json({ total: todaysMedicinesCount });
  } catch (error) {
    console.error('Error fetching today\'s registered medicine count:', error);
    res.status(500).json({ message: 'Failed to fetch today\'s registered medicine count' });
  }
}

exports.getSoonExpiringMedicinesCount = async (req, res) => {
  try {
    const today = moment();
    const expiryThresholdDays = 50;

    const soonExpiringMedicinesCount = await Medicine.countDocuments({
      expiry_date: {
        $gte: today.toDate(), 
        $lte: today.clone().add(expiryThresholdDays, 'days').toDate(),
      },
    });

    res.status(200).json({ total: soonExpiringMedicinesCount });
  } catch (error) {
    console.error('Error fetching soon expiring medicines count:', error);
    res.status(500).json({ message: 'Failed to fetch soon expiring medicines count' });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;


    if (updates.expiry) {
      const expiryDate = new Date(updates.expiry);
      if (isNaN(expiryDate.getTime())) {
        return res.status(400).json({ error: 'Invalid expiry date' });
      }
      updates.expiry = expiryDate;
    }

    if (updates.quantity !== undefined || updates.unit_price !== undefined) {
      const medicine = await Medicine.findById(id);
      const quantity = Number(updates.quantity !== undefined ? updates.quantity : medicine.quantity);
      const unit_price = Number(updates.unit_price !== undefined ? updates.unit_price : medicine.unit_price);
      updates.total_price = quantity * unit_price;
    }
    
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.status(200).json({
      success: true,
      data: updatedMedicine,
      message: 'Medicine updated successfully'
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};



exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMedicine = await Medicine.findByIdAndDelete(id);

    if (!deletedMedicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully',
      data: deletedMedicine,
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier } = req.body; 

    if (!supplier) {
      return res.status(400).json({
        success: false,
        message: 'Supplier name is required',
      });
    }

   
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { supplier }, 
      { new: true, runValidators: true } 
    );

    if (!updatedMedicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supplier name updated successfully',
      data: updatedMedicine,
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update supplier',
      error: error.message,
    });
  }
};