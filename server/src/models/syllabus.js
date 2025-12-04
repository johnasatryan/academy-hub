import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: String,
  duration: String,
  topics: [String],
});

const phaseSchema = new mongoose.Schema({
  title: String,
  description: String,
  modules: [moduleSchema],
});
const syllabusSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    instructor: String,
    duration: String,
    level: String,
    category: String,
    prerequisites: String,
    resources: String,
    tags: [String],
    tasks: [String],
    phases: [phaseSchema],
  },
  { timestamps: true },
);

export default mongoose.model('Syllabus', syllabusSchema);
