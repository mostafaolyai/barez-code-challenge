import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './apis/user/user.service';
import { getJwtMiddleware,  } from './auth/middleware/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });


  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('The user management API with JWT authentication for Barez Company')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);



  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);
await userService.seed();


app.use(getJwtMiddleware(jwtService, userService));

  await app.listen(3000);
}
bootstrap();
