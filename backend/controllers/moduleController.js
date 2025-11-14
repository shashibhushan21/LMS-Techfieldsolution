const Module = require('../models/Module');
const Internship = require('../models/Internship');

/**
 * @desc    Get all modules
 * @route   GET /api/modules
 * @access  Private
 */
exports.getModules = async (req, res, next) => {
  try {
    const { internship } = req.query;

    const query = {};
    if (internship) query.internship = internship;

    const modules = await Module.find(query)
      .populate('internship', 'title domain')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single module
 * @route   GET /api/modules/:id
 * @access  Private
 */
exports.getModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('internship', 'title domain');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create module
 * @route   POST /api/modules
 * @access  Private/Admin/Mentor
 */
exports.createModule = async (req, res, next) => {
  try {
    const { internship } = req.body;

    // Verify internship exists
    const internshipDoc = await Internship.findById(internship);
    if (!internshipDoc) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const module = await Module.create(req.body);

    res.status(201).json({
      success: true,
      data: module
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update module
 * @route   PUT /api/modules/:id
 * @access  Private/Admin/Mentor
 */
exports.updateModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedModule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete module
 * @route   DELETE /api/modules/:id
 * @access  Private/Admin/Mentor
 */
exports.deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    await module.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Publish module
 * @route   PATCH /api/modules/:id/publish
 * @access  Private/Admin/Mentor
 */
exports.publishModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    module.isPublished = true;
    await module.save();

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get modules by internship
 * @route   GET /api/modules/internship/:internshipId
 * @access  Private
 */
exports.getInternshipModules = async (req, res, next) => {
  try {
    const modules = await Module.find({ internship: req.params.internshipId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    next(error);
  }
};
