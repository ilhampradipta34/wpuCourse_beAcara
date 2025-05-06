import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

const doc = {
  info: {
    title: "Dokumentasi backend-API acara",
    description: "API for managing events and booking tickets",
    version: "v0.0.1",
  },
  servers: [
    {
      url: "https://wpu-course-be-acara.vercel.app/api",
      description: "deploy server prodcion",
    },
    {
      url: "http://localhost:3000/api",
      description: "server local development",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        // bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "bgs",
        password: "bgs1234",
      },
      RegisterRequest: {
        fullName: "joni",
        username: "jon1234",
        email: "joni@gmail.com",
        password: "Joni1234",
        confirmpassword: "Joni1234",
      },
      ActivationRequest: {
        code: "abcdef",
      },
      CreateCategoryRequest: {
        name: "New Category",
        description: "Category description",
        icon: "",
      },
      CreateEventRequest: {
        name: "Event Name 2",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        description: "This is a sample description of the event 2.",
        category: "Category ObjectId",
        banner:
          "fileUrl",
        isFeatured: false,
        isOnline: false,
        isPublish: false,
        location: {
          region: "region id",
          coordinates: [0, 0],
          address: "",
        },
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateBannerRequest: {
        title : "banner 3 - title",
        image: "https://res.cloudinary.com/dqjz54irk/image/upload/v1746335711/qrsv7x3vqirlcbwdnvkd.png",
        isShow: false
    },
      CreateTicketRequest: {
        price: 300000,
        name: "Workshop Data Analyst",
        events: "681864de648297e57cdfbe22",
        description: "Sesi pelatihan interaktif selama 2 hari untuk memahami dasar analisis data menggunakan Excel dan SQL.",
        quantity: 40
      }
      ,
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
