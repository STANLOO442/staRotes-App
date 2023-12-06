"use strict";
/**import { Request, Response } from 'express';

interface CustomResponse extends Response {
  render(view: string, locals?: Record<string, any>): void;
}

export const homepage = async (req: Request, res: Response): Promise<void> => {
    const locals = {
      title: "Stanley's Note App",
      description: "Express.ts"
    };
  
    res.render('index',{
        locals,
        layout: '../my-views/layouts/font-page'
    });
  };

  export const about = async (req: Request, res: Response): Promise<void> => {
    const locals = {
      title: " About Stanley's Note ",
      description: "Express.ts"
    };
  
    res.render('about',locals);
  };/** */
