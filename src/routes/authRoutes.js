import express from 'express';
import {register, login, confirmEmail, } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleWare.js';