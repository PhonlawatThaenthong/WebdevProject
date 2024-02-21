'use strict';

/**
 * tour controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tour.tour', ({ strapi }) => ({

    async method_complete(ctx) {
        const entityId = ctx.params.id;
        try {
            let target_Tour = await strapi.entityService.findOne('api::tour.tour', entityId)
            target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                data: {
                    user_amount: (target_Tour.user_amount || 0) + 1
                }
            })
            ctx.body = {
                status: "YES",
                message: "Action Completed!"
            };
        } catch (err) {
            ctx.body = err;
        }
    },

}));
