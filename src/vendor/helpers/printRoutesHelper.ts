import path from 'path';
import { Router } from 'express';

function getPathFromRegex(regexp: RegExp) {
  return regexp
    .toString()
    .replace('/^', '')
    .replace('?(?=\\/|$)/i', '')
    .replace(/\\\//g, '/')
    .replace('(?:([^/]+?))', '');
}

function combineStacks(
  stack: any,
  expressRouter: Router,
  prefix: string,
): any[] {
  if (stack.handle.stack) {
    const routerPath = `${prefix}${getPathFromRegex(stack.regexp)}`.replace(
      '//',
      '/',
    );
    return stack.handle.stack
      .map((aStack: any) => {
        const stacks = !aStack.route
          ? combineStacks(aStack, expressRouter, routerPath)
          : [];
        return [
          ...stacks,
          {
            routerPath,
            ...aStack,
          },
        ];
      })
      .flat();
  }

  return [stack];
}

function getStacks(expressRouter: Router): any[] {
  return expressRouter.stack
    .map((stack: any) => combineStacks(stack, expressRouter, ''))
    .flat();
}

function printRoutesHelper(prefix: string, expressRouter: Router): void {
  expressRouter.get(`${prefix}/`);
  const stacks = getStacks(expressRouter);

  if (stacks) {
    const routeLogged: Record<string, unknown> = {};
    const routes = stacks
      .filter(stack => stack.route)
      .flatMap(stack =>
        stack.route.stack
          .map((route: { path: any; method: string }) => ({
            ...route,
            stackPath: path.resolve(
              [stack.routerPath, stack.route.path, route.path, route.method]
                .filter(s => !!s)
                .join(''),
            ),
          }))
          .filter((route: { method: string }) =>
            route.method ? route.method.toUpperCase() : null,
          )
          .map((route: { method: string; path: string; stackPath: string }) => {
            if (routeLogged[route.stackPath]) return undefined;
            const method = route.method.toUpperCase();
            routeLogged[route.stackPath] = true;
            return {
              method,
              path: route.stackPath.replace(new RegExp(`${route.method}$`), ''),
            };
          })
          .filter((route: any) => !!route),
      );

    console.groupCollapsed('Application Routes');
    console.table(routes);
    console.groupEnd();
  }
}

// eslint-disable-next-line import/prefer-default-export
export { printRoutesHelper };
