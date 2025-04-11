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
            url: "http://localhost:3000/api",
            decription: "server local development",
            
        },
        {
            url: "https://wpu-course-be-acara.vercel.app/api",
            descrption: "deploy server prodcion"
        }
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
                password: "bgs1234"
            },
            RegisterRequest: {
                fullName: "joni",
                username: "jon1234",
                email: "joni@gmail.com",
                password: "Joni1234",
                confirmpassword: "Joni1234"
            },
            ActivationRequest: {
                code: "abcdef"
            }
        }
    }
}

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);

