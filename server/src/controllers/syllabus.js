import Syllabus from '../models/syllabus.js';

/**
 * GET /api/syllabuses
 * Fetch all syllabuses
 */
export const getAllSyllabuses = async (req, res) => {
  try {
    const syllabuses = await Syllabus.find().sort({ createdAt: -1 });
    const formatted = syllabuses.map((s) => ({ ...s.toObject(), id: s._id }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/syllabuses/:id
 * Fetch a single syllabus by ID
 */
export const getSyllabusById = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);
    if (!syllabus)
      return res.status(404).json({ message: 'Syllabus not found' });
    res.json(syllabus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/syllabuses
 * Create a new syllabus
 */
export const createSyllabus = async (req, res) => {
  try {
    const syllabus = new Syllabus(req.body);
    const saved = await syllabus.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/syllabuses/:id
 * Update existing syllabus
 */
export const updateSyllabus = async (req, res) => {
  try {
    const updated = await Syllabus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: 'Syllabus not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /api/syllabuses/:id
 * Delete syllabus
 */
export const deleteSyllabus = async (req, res) => {
  try {
    const deleted = await Syllabus.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Syllabus not found' });
    res.json({ message: 'Syllabus deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
