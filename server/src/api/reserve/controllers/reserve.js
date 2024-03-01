'use strict';

/**
 * reserve controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::reserve.reserve', ({ strapi }) => ({
    
    async confirm(ctx) {
        const entityId = ctx.params.id;
        try {

            let item = await strapi.entityService.findOne("api::reserve.reserve", entityId, {
                populate: '*',
            });

            if (ctx.state.user.role.name != "admin") {
                item = await strapi.entityService.update("api::reserve.reserve", entityId, {
                    data: {
                        payment_status: true
                        
                    }
                })
                ctx.body = { Stats: "Update" }

            } 
            else {
                ctx.body = { Stats: "Error Confirm Payment", seenDatetime: "cannot be update" }
            }


        } catch (err) {
            ctx.body = "error"
        }

    },
})
);
