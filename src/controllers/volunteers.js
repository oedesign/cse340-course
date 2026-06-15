import {
  addVolunteer,
  removeVolunteer
} from '../models/volunteers.js';

export async function volunteerForProject(req, res, next) {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}

export async function removeVolunteerFromProject(req, res, next) {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}