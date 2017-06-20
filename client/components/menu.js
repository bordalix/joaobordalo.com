Template.menu.helpers({
  isActive(routeName) {
    const currentRoute = Router.current();
    return currentRoute && currentRoute.route && routeName === currentRoute.route.getName() ? 'is-active' : '';
  }
});
