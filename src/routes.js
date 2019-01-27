export const routes = [
  {
    path: '/index',
    name: 'search',
    page: 'Search.vue'
  },
  {
    path: '/about',
    name: 'about',
    page: 'About.vue'
  },
  {
    path: '*',
    redirect: '/index'
  }
]
export const mapRoutes = () => {
  const mappedRoutes = []
  routes.forEach(route => {
    if (!route.redirect && route.path !== '*') {
      mappedRoutes.push(route.path.replace('/:optional?/:sub?', ''))
    }
  })
  return mappedRoutes
}
