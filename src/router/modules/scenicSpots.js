/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const scenicSpotsRouter = {
  path: '/scenicSpots',
  component: Layout,
  redirect: 'noredirect',
  name: 'ScenicSpots',
  meta: {
    title: 'scenicSpots',
    icon: 'international'
  },
  children: [
  ]
}

export default scenicSpotsRouter
