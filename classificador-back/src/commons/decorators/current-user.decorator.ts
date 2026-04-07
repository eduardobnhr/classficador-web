// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Usuario } from 'src/models/entities/dbacesso/usuario.entity';
// import { AuthRequest } from 'src/models/interfaces/auth/AuthRequest';


// export const CurrentUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext): Usuario => {
//     const request = context.switchToHttp().getRequest<AuthRequest>();

//     return request.user;
//   },
// );
