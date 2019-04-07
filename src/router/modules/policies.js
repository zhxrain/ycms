/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const policiesRouter = {
  path: '/policies',
  component: Layout,
  redirect: 'noredirect',
  name: 'policies',
  meta: {
    title: 'policies',
    icon: 'documentation'
  },
  children: [
    {
      path: 'tourStandard',
      component: () => import('@/views/components-demo/tinymce'),
      name: 'Standard',
      meta: { title: 'tourStandard' }
    },
    {
      path: 'tourPlanHarvest',
      component: () => import('@/views/components-demo/markdown'),
      name: 'TourPlanHarvest',
      meta: { title: 'tourPlanHarvest' }
    },
    {
      path: 'tourRouteManage',
      component: () => import('@/views/components-demo/jsonEditor'),
      name: 'TourRouteManage',
      meta: { title: 'tourRouteManage' }
    },
    {
      path: 'importantTourProjectManage',
      component: () => import('@/views/components-demo/splitpane'),
      name: 'ImportantTourProjectManage',
      meta: { title: 'importantTourProjectManage' }
    }
  ]
}

export default policiesRouter
