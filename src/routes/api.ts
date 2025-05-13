import express from "express";
import authController from "../controllers/authController";
import middleware from "../middleware/middleware";
import aclMidlleware from "../middleware/acl.midlleware";
import { ROLES } from "../utils/constant";
import mediaMidlleware from "../middleware/media.midlleware";
import mediaController from "../controllers/mediaController";
import categoryController from "../controllers/categoryController";
import regionController from "../controllers/regionController";
import eventsController from "../controllers/eventsController";
import ticketController from "../controllers/ticketController";
import bannerController from "../controllers/bannerController";
import orderController from "../controllers/orderController";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", middleware, authController.me);
router.post("/auth/activation", authController.activation);

router.post(
  "/orders",
  [middleware, aclMidlleware([ROLES.MEMBER])],
  orderController.create
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateOrderRequest"
    }
  }
  */
);
router.get(
  "/orders",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  orderController.findAll
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);
router.get(
  "/orders/:orderId",
  [middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER])],
  orderController.findOne
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);
router.put(
  "/orders/:orderId/completed",
  [middleware, aclMidlleware([ROLES.MEMBER])],
  orderController.complete
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);
router.put(
  "/orders/:orderId/pending",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  orderController.pending
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);
router.put(
  "/orders/:orderId/cancelled",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  orderController.cancelled
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);

router.get(
  "/orders-history",
  [middleware, aclMidlleware([ROLES.MEMBER])],
  orderController.findAllByMember
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);

router.delete(
  "/orders/:orderId",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  orderController.remove
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);



router.post(
  "/tickets",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  ticketController.create

  /*

#swagger.tags = ['Ticket']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateTicketRequest'
  }

}

*/
);
router.get(
  "/tickets",
  ticketController.findAll

  /*

#swagger.tags = ['Ticket']


*/
);
router.get(
  "/tickets/:id",
  ticketController.findOne

  /*

#swagger.tags = ['Ticket']


*/
);
router.put(
  "/tickets/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  ticketController.update

  /*

#swagger.tags = ['Ticket']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateTicketRequest'
  }

}

*/
);
router.delete(
  "/tickets/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  ticketController.remove

  /*

#swagger.tags = ['Ticket']
#swagger.security = [{
  "bearerAuth": {}
}]



*/
);
router.get(
  "/tickets/:eventId/events",
  ticketController.findAllByEvent

  /*

#swagger.tags = ['Ticket']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateTicketRequest'
  }

}

*/
);

router.post(
  "/banners",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  bannerController.create

  /*

#swagger.tags = ['Banner']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateBannerRequest'
  }

}

*/
);
router.get(
  "/banners",
  bannerController.findAll

  /*

#swagger.tags = ['Banner']


*/
);
router.get(
  "/banners/:id",
  bannerController.findOne

  /*

#swagger.tags = ['Banner']


*/
);
router.put(
  "/banners/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  bannerController.update

  /*

#swagger.tags = ['Banner']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateBannerRequest'
  }

}

*/
);
router.delete(
  "/banners/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  bannerController.remove

  /*

#swagger.tags = ['Banner']
#swagger.security = [{
  "bearerAuth": {}
}]


*/
);

router.post(
  "/category",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  categoryController.create
  /*

#swagger.tags = ['Category']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateCategoryRequest'
  }

}

*/
);
router.get(
  "/category",
  categoryController.findAll

  /*

#swagger.tags = ['Category']

}

*/
);
router.get(
  "/category/:id",
  categoryController.findOne

  /*

#swagger.tags = ['Category']


*/
);
router.put(
  "/category/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  categoryController.update

  /*

#swagger.tags = ['Category']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateCategoryRequest'
  }

}

*/
);

router.delete(
  "/category/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  categoryController.remove

  /*

#swagger.tags = ['Category']
#swagger.security = [{
  "bearerAuth": {}
}]


*/
);

router.post(
  "/events",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  eventsController.create

  /*

#swagger.tags = ['Events']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateEventRequest'
  }

}

*/
);

router.get(
  "/events",
  eventsController.findAll

  /*

#swagger.tags = ['Events']
#swagger.parameters['limit'] = {
  in: 'query',
  type: 'number',
  default: 10
}
#swagger.parameters['page'] = {
  in: 'query',
  type: 'number',
  default: 1
}
#swagger.parameters['category'] = {
  in: 'query',
  type: 'string',
}
#swagger.parameters['isOnline'] = {
  in: 'query',
  type: 'boolean'
}
#swagger.parameters['isFeatured'] = {
  in: 'query',
  type: 'boolean'
}
#swagger.parameters['isPublish'] = {
  in: 'query',
  type: 'boolean'
}
#swagger.parameters['limit'] = {
  in: 'query',
  type: 'number',
  default: 10
}

*/
);

router.get(
  "/events/:id",
  eventsController.findOne

  /*

#swagger.tags = ['Events']


*/
);

router.get(
  "/events/:slug/slug",
  eventsController.findOneBySlug

  /*

#swagger.tags = ['Events']

*/
);

router.put(
  "/events/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  eventsController.update

  /*

#swagger.tags = ['Events']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/CreateEventRequest'
  }

}

*/
);

router.delete(
  "/events/:id",
  [middleware, aclMidlleware([ROLES.ADMIN])],
  eventsController.remove

  /*

#swagger.tags = ['Events']
#swagger.security = [{
  "bearerAuth": {}
}]



*/
);

router.get(
  "/regions",
  regionController.getAllProvinces

  /*

#swagger.tags = ['Regions']


*/
);

router.get(
  "/regions/:id/provincze",
  regionController.getProvince

  /*

#swagger.tags = ['Regions']


*/
);

router.get(
  "/regions/:id/regency",
  regionController.getRegency

  /*

#swagger.tags = ['Regions']


*/
);

router.get(
  "/regions/:id/district",
  regionController.getDistrict

  /*

#swagger.tags = ['Regions']


*/
);

router.get(
  "/regions/:id/village",
  regionController.getVillage

  /*

#swagger.tags = ['Regions']


*/
);

router.get(
  "/regions-search",
  regionController.findByCity

  /*

#swagger.tags = ['Regions']


*/
);

router.post(
  "/media/upload-single",
  [
    middleware,
    aclMidlleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMidlleware.single("file"),
  ],
  mediaController.single

  /*

#swagger.tags = ['Media']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  content: {
    'multipart/form-data': {
    
      schema: {
        type: 'object',
        properties: {
          file: {
            type: "string",
            format: "binary"
          }
        } 
      }
    }
    
  }


}

*/
);

router.post(
  "/media/upload-multiple",
  [
    middleware,
    aclMidlleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMidlleware.multiple("files"),
  ],
  mediaController.multiple

  /*

#swagger.tags = ['Media']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  content: {
    'multipart/form-data': {
    
      schema: {
        type: 'object',
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary"
            }
          }
        } 
      }
    }
    
  }


}

*/
);

router.delete(
  "/media/remove",
  [middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER])],
  mediaController.remove

  /*

#swagger.tags = ['Media']
#swagger.security = [{
  "bearerAuth": {}
}]

#swagger.requestBody = {
  required: true,
  schema: {
    $ref: '#/components/schemas/RemoveMediaRequest'
  }


}

*/
);

export default router;
