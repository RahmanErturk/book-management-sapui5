import { Request, Response } from 'express';
import Book from '../models/Book';
import mongoose from 'mongoose';

interface BookFilter {
  title?: { $regex: string; $options: string };
  createdAt?: { $gte: Date; $lte: Date };
}

export const getBooks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, date} = req.query as { title?: string; date?: string };
    const filter: BookFilter = {};
    if (title) {
      filter.title = { $regex: title as string, $options: 'i' }; // Case-insensitive search
    }
    
    if (date) {
      const [start, end] = date.split('_').map(d => new Date(d));
      filter.createdAt = { $gte: start, $lte: end };
    }
    const books = await Book.find(filter);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books', error });
  }
}

export const createBook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, author, createdBy } = req.body;
    const newBook = new Book({ title, author, createdBy });
    await newBook.save();
    return res.status(201).json(newBook);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Invalid Data', error: error.message });
    }
    return res.status(500).json({ message: 'Error creating book', error });
  }
}

export const updateBook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(updatedBook);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Invalid Data', error: error.message });
    }
    return res.status(500).json({ message: 'Error updating book', error });
  }
}

export const deleteBook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting book', error });
  }
}