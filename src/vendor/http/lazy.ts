import { container } from 'tsyringe';
import { Router, NextFunction, Request, Response } from 'express';
import ConsoleLog from '@libs/ConsoleLog';
import api from '../config/api';

export type CreateLazyHttpOptions = {
  lazyRouter?: {
    /**
     * if preload is true, load router asap
     * Default: false
     */
    preload?: boolean;
  };
  lazyCtrl?: {
    /**
     * If true, don't try to get the Controller from the DI container and,
     * instead, just instantiate it.
     */
    unresolved?: boolean;
  };
};

export type CreateLazyHttpReturn = {
  lazyRouter: (resolver: () => Promise<{ default: Router } | Router>) => Router;

  lazyCtrl: <
    // eslint-disable-next-line no-use-before-define
    T extends { [P in Y]: (...args: any[]) => Promise<void> },
    Y extends keyof T,
  >(
    Controller: new (...args: any[]) => T,
    method: Y,
  ) => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void> | undefined;
};

const apiConfig = api();
let loadedRouter: Router;

const resolveResolver = (
  resolver: () => Promise<{ default: Router } | Router>,
) => {
  return resolver().then(router => {
    if ('default' in router) loadedRouter = router.default;
    else loadedRouter = router;

    // lazyRouter = loadedRouter;
    return loadedRouter;
  });
};

function lazyRouterProxyMaker(
  lazyRouterOptions: CreateLazyHttpOptions['lazyRouter'],
  router: Router,
) {
  const preload =
    lazyRouterOptions?.preload ?? apiConfig.DEBUG_LEVEL.includes('ROUTES');

  const lazyRouter: CreateLazyHttpReturn['lazyRouter'] = resolver => {
    // Preserve loading order of router for default error handler

    const lazyRouterProxy = new Proxy(router, {
      get(target, prop, receiver) {
        return Reflect.get(loadedRouter ?? target, prop, receiver);
      },
    });

    router.use((req, res, next) => {
      if (loadedRouter) return loadedRouter(req, res, next);

      // request handler at first time
      return resolveResolver(resolver)
        .then(() => loadedRouter(req, res, next))
        .catch(error => next(error));
    });

    if (preload) {
      resolveResolver(resolver).catch(error =>
        ConsoleLog.print(
          `[lazy-router] Fail to preload ${error}`,
          'error',
          'LAZY_ROUTER',
        ),
      );
    }

    return lazyRouterProxy;
  };

  return lazyRouter;
}

function lazyCtrlMaker(lazyCtrlOptions: CreateLazyHttpOptions['lazyCtrl']) {
  const lazyCtrl: CreateLazyHttpReturn['lazyCtrl'] = (Controller, method) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const controller = lazyCtrlOptions?.unresolved
        ? new Controller()
        : container.resolve(Controller);

      return controller[method](req, res, next).catch(e => next(e));
    };
  };
  return lazyCtrl;
}

export default function createLazyHttp(
  options?: CreateLazyHttpOptions,
): CreateLazyHttpReturn {
  return {
    lazyRouter: lazyRouterProxyMaker(options?.lazyRouter, Router()),
    lazyCtrl: lazyCtrlMaker(options?.lazyCtrl),
  };
}
