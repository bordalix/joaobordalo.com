Template.menu.helpers({
  isActive: function (routeName) {
    var currentRoute = Router.current();
    return currentRoute && currentRoute.route && routeName === currentRoute.route.getName() ? 'is-active' : '';
  }
})