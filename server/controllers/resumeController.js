import * as resumeService from "../services/resumeService.js";
import {
  createResumeSchema,
  updateResumeSchema,
  queryResumeSchema,
} from "../validators/resumeValidator.js";

/**
 * Controller: Daftar resume pengguna
 */
export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user._internalId || req.user.id;
    const query = queryResumeSchema.parse(req.query);
    const result = await resumeService.listResumes(userId, query);

    res.json({
      success: true,
      message: "Daftar resume berhasil diambil.",
      data: result.items,
      meta: result.meta,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Buat resume baru
 */
export const createResume = async (req, res, next) => {
  try {
    const userId = req.user._internalId || req.user.id;
    const payload = createResumeSchema.parse(req.body);
    const result = await resumeService.createResume(userId, payload, req.user);

    res.status(201).json({
      success: true,
      message: "Resume baru berhasil dibuat.",
      data: result,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Detail resume
 */
export const getResume = async (req, res, next) => {
  try {
    const userId = req.user._internalId || req.user.id;
    const result = await resumeService.getResumeByPublicId(userId, req.params.id);

    res.json({
      success: true,
      message: "Detail resume berhasil diambil.",
      data: result,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Perbarui resume
 */
export const updateResume = async (req, res, next) => {
  try {
    const userId = req.user._internalId || req.user.id;
    const payload = updateResumeSchema.parse(req.body);
    const result = await resumeService.updateResume(userId, req.params.id, payload);

    res.json({
      success: true,
      message: "Resume berhasil diperbarui.",
      data: result,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Duplikasi resume
 */
export const duplicateResume = async (req, res, next) => {
  try {
    const userId = req.user._internalId || req.user.id;
    const result = await resumeService.duplicateResume(userId, req.params.id);

    res.status(201).json({
      success: true,
      message: "Resume berhasil diduplikasi.",
      data: result,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Hapus resume
 */
export const deleteResume = async (req, res, next) => {
  try {
    const userId = req.user._internalId || req.user.id;
    await resumeService.deleteResume(userId, req.params.id);

    res.json({
      success: true,
      message: "Resume berhasil dihapus.",
      data: null,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};
