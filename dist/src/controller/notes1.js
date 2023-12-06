"use strict";
/**import {Request, Response, NextFunction, RequestHandler, response} from "express";
import Note from '../model/notes';
import Notes from "../model/notes";


export const createNote: RequestHandler = async (req, res, next) => {
    try {
    
        const {title, description, duedate, status, userId} = req.body;
        console.log(title, description);

        //create a note
        const note = await Note.create({ title, description, duedate, status, userId });

        res.status(201).json({note:note});
     
    } catch (error) {
        res.status(500).json({message: "Failed", error });
    }
 }

 export const findAll: RequestHandler = async (req, res, next) => {
    try {
     
        const notes = await Note.findAll();
        res.status(200).json({status: 'success', notes:Notes});
     
    } catch (error) {
        res.status(500).json({message: "Failed", error });
    }
 }

 export const findOne: RequestHandler = async (req, res, next) => {
    try {
     
        const id  = req.params.id;
        const note = await Note.findByPk(id);

        res.status(200).json({status: 'success', note});
     
    } catch (error) {
        res.status(500).json({message: "Failed", error });
    }
 }


 export const updateNote: RequestHandler = async (req, res, next) => {
    try {
     
        const id  = req.params.id;
        
        const note = await Note.findByPk(id);
        if(!note) {
            return res.status(404).json({message: "Use Not Found"})
        }

        await note.update({...req.body})
        await note.save()
        
        res.status(201).json({user:note});
     
    } catch (error) {
        res.status(500).json({message: "Failed", error });
    }
 }


 export const deleteNote: RequestHandler = async (req, res, next) => {
    try {
     
        const id  = req.params.id;
        
        const note = await Note.findByPk(id);
        if(!note) {
            return res.status(404).json({message: "Use Not Found"})
        }
        
        await note.destroy();

        res.status(204).json({user:note});
     
    } catch (error) {
        res.status(500).json({message: "Failed", error });
    }
 }**/ 
