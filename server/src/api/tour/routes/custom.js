'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/tours/:id/complete',
      handler: 'tour.method_complete'
    }
  ]
}