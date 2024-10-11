import { CanDeactivateFn } from '@angular/router';

export const enableLoaderGuard: CanDeactivateFn<unknown> = (component: any, currentRoute, currentState, nextState: any) => {
  return component.canDeactivate ? component.canDeactivate(nextState) : true;
};
