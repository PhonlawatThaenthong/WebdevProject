'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/tours/:id/complete',
      handler: 'tour.method_complete'
    }
  ]
}