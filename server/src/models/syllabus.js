import mongoose from 'mongoose';

// MODULE schema --------------------------------------
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String },
  topics: { type: [String], default: [] },
});

// PHASE schema ----------------------------------------
const phaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  instructor: { type: String },
  duration: { type: Number },
  prerequisites: { type: String },

  modules: { type: [moduleSchema], default: [] },
});

// SYLLABUS schema -------------------------------------
const syllabusSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    level: { type: String },
    category: { type: String },
    resources: { type: String },
    tags: { type: [String], default: [] },
    tasks: { type: [String], default: [] },
    phases: { type: [phaseSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Syllabus', syllabusSchema);
