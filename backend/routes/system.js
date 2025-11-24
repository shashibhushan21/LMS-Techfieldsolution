const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const SystemSettings = require('../models/SystemSettings');

/**
 * @desc    Get system settings
 * @route   GET /api/admin/system/settings
 * @access  Private/Admin
 */
router.get('/settings', protect, authorize('admin'), async (req, res, next) => {
    try {
        const settings = await SystemSettings.getSettings();
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc    Toggle maintenance mode
 * @route   PUT /api/admin/system/maintenance
 * @access  Private/Admin
 */
router.put('/maintenance', protect, authorize('admin'), async (req, res, next) => {
    try {
        const { maintenanceMode, maintenanceMessage, maintenanceStartTime, maintenanceEndTime } = req.body;

        const settings = await SystemSettings.getSettings();

        if (maintenanceMode !== undefined) {
            settings.maintenanceMode = maintenanceMode;
        }

        if (maintenanceMessage !== undefined) {
            settings.maintenanceMessage = maintenanceMessage;
        }

        if (maintenanceStartTime !== undefined) {
            settings.maintenanceStartTime = maintenanceStartTime;
        }

        if (maintenanceEndTime !== undefined) {
            settings.maintenanceEndTime = maintenanceEndTime;
        }

        settings.updatedBy = req.user.id;
        await settings.save();

        res.status(200).json({
            success: true,
            data: settings,
            message: `Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'} successfully`
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc    Get maintenance status (public endpoint)
 * @route   GET /api/system/maintenance-status
 * @access  Public
 */
router.get('/maintenance-status', async (req, res, next) => {
    try {
        const settings = await SystemSettings.getSettings();
        res.status(200).json({
            success: true,
            data: {
                maintenanceMode: settings.maintenanceMode,
                maintenanceMessage: settings.maintenanceMessage,
                maintenanceStartTime: settings.maintenanceStartTime,
                maintenanceEndTime: settings.maintenanceEndTime
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
