import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {authenticate, rateLimit, routeToFunction} from "./middlewares.js";
import {getApiKey} from "./controllers/api_keys.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));
router.get('/v1/api-keys/:api_key_code', authenticate, rateLimit, routeToFunction(getApiKey));

export default router;