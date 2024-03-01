'use strict';

/**
 * reserve controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::reserve.reserve', ({ strapi }) => ({

    async method_confirm(ctx) {
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
                ctx.body = {
                    status: "OK",
                    message: "Action Completed!"
                };

            }
            else {
                ctx.body = {
                    status: "Denied",
                    message: "No Permission."
                };
            };

        } catch (err) {
            ctx.body = {
                status: "Failed",
                message: err
            };
        }

    },
    async create_reserve(ctx) {
        const entityId = ctx.params.id;
        const { numberOfPeople } = ctx.request.body;
        console.log(numberOfPeople);
        try {
            let target_Tour = await strapi.entityService.findOne('api::tour.tour', entityId)

            if ((target_Tour.user_amount + numberOfPeople) >= target_Tour.user_max) {
                target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                    data: {
                        user_amount: (target_Tour.user_amount || 0) + numberOfPeople,
                        status: false
                    }
                })
            } else {
                target_Tour = await strapi.entityService.update('api::tour.tour', entityId, {
                    data: {
                        user_amount: (target_Tour.user_amount || 0) + numberOfPeople,
                    }
                })
            }

            ctx.body = {
                status: "OK",
                message: "Action Completed!",
                
            };
        } catch (err) {
            ctx.body = {
                status: "Failed",
                message: err
            };
        }
    },
})
);
