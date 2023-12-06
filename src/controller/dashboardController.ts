import { Request, Response } from 'express';

interface CustomResponse extends Response {
  render(view: string, locals?: Record<string, any>): void;
}

/**export const dashboardController = async (req: Request, res: Response): Promise<void> => {
    const locals = {
      title: "Dashboard",
      description: "Express.ts"
    };
  
    res.render('dashboard/index',{
        locals,
        layout: '../my-views/layouts/dashboard'
    });
  };**/