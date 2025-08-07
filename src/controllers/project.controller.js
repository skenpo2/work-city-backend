import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import ProjectModel from '../models/project.model.js';
import { createProjectService } from '../services/project.service.js';
import { NotFoundException } from '../utils/appError.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validations/project.validation.js';

export const createProject = AsyncHandler(async (req, res, next) => {
  const body = createProjectSchema.parse({ ...req.body });

  const project = await createProjectService(body);

  return res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: 'Project created successfully',
    project,
  });
});

export const getProject = AsyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const [projects, totalProjects] = await Promise.all([
    ProjectModel.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit),
    ProjectModel.countDocuments(),
  ]);

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    page,
    limit,
    totalPages: Math.ceil(totalProjects / limit),
    totalProjects,
    projects,
  });
});

export const getProjectById = AsyncHandler(async (req, res, next) => {
  const project = await ProjectModel.findById(req.params.id);
  if (!project) {
    throw new NotFoundException("Project not found'");
  }

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    project,
  });
});

export const updateProjectById = AsyncHandler(async (req, res, next) => {
  const body = updateProjectSchema({ ...req.body });
  const project = await ProjectModel.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  if (!project) {
    throw new NotFoundException('Project not found');
  }
  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Project updated successfully',
    project,
  });
});

export const deleteProject = AsyncHandler(async (req, res, next) => {
  const project = await ProjectModel.findByIdAndDelete(req.params.id);
  if (!project) {
    throw new NotFoundException('Project not found');
  }

  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'Project deleted successfully',
    project,
  });
});
