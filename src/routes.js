export const routes = [
  {
    path: '/iJerky/index',
    name: 'search',
    page: 'Search.vue'
  },
  {
    path: '/iJerky/about',
    name: 'about',
    page: 'About.vue'
  },
  {
    path: '*',
    redirect: '/iJerky/index'
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
