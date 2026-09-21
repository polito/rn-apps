import { setupServer } from 'msw/node';

import { commonRoutes } from './commonRoutes';

export const server = setupServer(...commonRoutes());
