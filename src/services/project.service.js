import ProjectModel from '../models/project.model.js';

export const createProjectService = async (body) => {
  const { title, description, clientId } = body;
  try {
    const project = new ProjectModel({ title, description, clientId });

    await project.save();

    return project;
  } catch (error) {
    throw error;
  }
};
