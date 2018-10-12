import elasticsearch from 'elasticsearch';
import express from 'express';
import bodyParser from 'body-parser';
import projectsRoutes from './projects';
import { getProjects } from './utils/projects';
import startProject from './startProject';
import { ES_HOST, PROJECT_ID, MAX_LIVE_VERSIONS } from './utils/config';
import { fetchProjects } from './projects/getProjects';

let startSingleProject = async ({
  projectId,
  es,
  graphqlOptions,
  enableAdmin,
}) => {
  try {
    await startProject({ es, id: projectId, graphqlOptions, enableAdmin });
  } catch (error) {
    console.warn(error.message);
  }
};

export default async ({
  projectId = PROJECT_ID,
  esHost = ES_HOST,
  graphqlOptions = {},
  enableAdmin = false,
} = {}) => {
  enableAdmin
    ? console.log('Application started in ADMIN mode!!')
    : console.log('Application started in read-only mode.');
  const router = express.Router();
  router.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  router.use(bodyParser.json({ limit: '50mb' }));

  router.use('/:projectId', (req, res, next) => {
    let projects = getProjects();
    if (!projects.length) return next();
    let project = projects.find(
      p => p.id.toLowerCase() === req.params.projectId.toLowerCase(),
    );
    if (project) {
      return project.app(req, res, next);
    }
    next();
  });

  router.use('/projects', projectsRoutes({ graphqlOptions, enableAdmin }));
  if (esHost) {
    const es = new elasticsearch.Client({ host: esHost });
    if (projectId) {
      startSingleProject({ projectId, es, graphqlOptions, enableAdmin });
    } else {
      const { projects = [] } = await fetchProjects({ es });

      await Promise.all(
        projects
          .filter(project => project.active)
          .slice(0, MAX_LIVE_VERSIONS)
          .map(async project => {
            try {
              await startSingleProject({
                projectId: project.id,
                es,
                graphqlOptions,
                enableAdmin,
              });
            } catch (error) {
              console.warn(error.message);
            }
          }),
      );
    }
  }

  return router;
};
