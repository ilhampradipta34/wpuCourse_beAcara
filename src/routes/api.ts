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

const router = express.Router();


router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', middleware, authController.me);
router.post('/auth/activation', authController.activation);

router.post('/category', [middleware, aclMidlleware([ROLES.ADMIN])], categoryController.create
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
router.get('/category', categoryController.findAll

  /*

#swagger.tags = ['Category']

}

*/
);
router.get('/category/:id', categoryController.findOne

  /*

#swagger.tags = ['Category']


*/

);
router.put('/category/:id', [middleware, aclMidlleware([ROLES.ADMIN])], categoryController.update

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

router.delete('/category/:id', [middleware, aclMidlleware([ROLES.ADMIN])], categoryController.remove

/*

#swagger.tags = ['Category']
#swagger.security = [{
  "bearerAuth": {}
}]


*/

);

router.post('/events', [middleware, aclMidlleware([ROLES.ADMIN])], eventsController.create

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

)

router.get('/events', eventsController.findAll

  /*

#swagger.tags = ['Events']


*/

)


router.get('/events/:id', eventsController.findOne

/*

#swagger.tags = ['Events']


*/

)

router.get('/events/:slug/slug', eventsController.findOneBySlug

/*

#swagger.tags = ['Events']

*/

)

router.put('/events/:id', [middleware, aclMidlleware([ROLES.ADMIN])], eventsController.update

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

)

router.delete('/events/:id', [middleware, aclMidlleware([ROLES.ADMIN])], eventsController.remove

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

)


router.get('/regions', regionController.getAllProvinces

  /*

#swagger.tags = ['Regions']


*/

)

router.get('/regions/:id/provincze', regionController.getProvince


  /*

#swagger.tags = ['Regions']


*/

)

router.get('/regions/:id/regency', regionController.getRegency


  /*

#swagger.tags = ['Regions']


*/

)

router.get('/regions/:id/district', regionController.getDistrict


  /*

#swagger.tags = ['Regions']


*/

)

router.get('/regions/:id/village', regionController.getVillage


  /*

#swagger.tags = ['Regions']


*/

)

router.get('/regions-search', regionController.findByCity


  /*

#swagger.tags = ['Regions']


*/

)


router.post('/media/upload-single', [
  middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMidlleware.single('file')
], mediaController.single

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

router.post('/media/upload-multiple',  [
    middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMidlleware.multiple('files')
  ], mediaController.multiple

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

router.delete('/media/remove',  [
    middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER])
  ], mediaController.remove

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

)



export default router;