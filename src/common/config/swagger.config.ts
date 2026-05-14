import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('MyCRM Project')
    .setDescription('MyCRM REST API')
    .setVersion('1.0')
    .addTag('Nest JS', 'Swagger')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: `
        .swagger-ui { background-color: #121212; color: #e0e0e0; }
        .swagger-ui .info .title, .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info table { color: #e0e0e0; }
        .swagger-ui .scheme-container { background-color: #1e1e1e; border-top: 1px solid #333; box-shadow: none; }
        .swagger-ui .opblock-tag { color: #fff; border-bottom: 1px solid #333; }
        .swagger-ui .opblock-tag:hover { background: rgba(255,255,255,0.05); }
        .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-description { color: #ccc; }
        .swagger-ui .model-box { background-color: #1e1e1e; }
        .swagger-ui .model { color: #e0e0e0; }
        .swagger-ui .btn { color: #e0e0e0; border-color: #444; background: #333; }
        .swagger-ui select { background-color: #333; color: #e0e0e0; border: 1px solid #444; }
        .swagger-ui input { background-color: #222; color: #fff; border: 1px solid #444; }
        .swagger-ui .topbar { background-color: #000; border-bottom: 2px solid #333; }
        .swagger-ui .opblock.opblock-get { background: rgba(97, 175, 254, 0.1); border-color: #61affe; }
        .swagger-ui .opblock.opblock-post { background: rgba(73, 204, 144, 0.1); border-color: #49cc90; }
        .swagger-ui .opblock.opblock-put { background: rgba(252, 161, 48, 0.1); border-color: #fca130; }
        .swagger-ui .opblock.opblock-delete { background: rgba(249, 62, 62, 0.1); border-color: #f93e3e; }
        .swagger-ui .opblock.opblock-patch { background: rgba(80, 227, 194, 0.1); border-color: #50e3c2; }
      `,
  });
}
