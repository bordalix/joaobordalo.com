Template.menu.helpers({
  isActive: function (routeName) {
    var currentRoute = Router.current();
    return currentRoute && routeName === currentRoute.route.getName() ? 'is-active' : '';
  }
})