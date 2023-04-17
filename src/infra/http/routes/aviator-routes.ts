import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/', (request:any, response: any):Promise<string>  => {
  return response.json("OK");
});

export default usersRouter;