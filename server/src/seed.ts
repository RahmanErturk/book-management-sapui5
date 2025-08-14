import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Book from './models/Book';

dotenv.config();

const fetchBooksFromAPI = async () => {
  try {
    // Örnek: Open Library API'den "javascript" konulu kitapları ara
    const response = await axios.get('https://openlibrary.org/search.json?q=javascript&limit=20');
    const docs = response.data.docs;

    // API’den gelen veriyi kendi Book modeline uyarlayalım
    return docs.map((doc: any) => ({
      title: doc.title || 'Unknown title',
      author: doc.author_name ? doc.author_name.join(', ') : 'Unknown author',
      createdBy: 'API Seed Script',
      createdAt: new Date(doc.first_publish_year || Date.now())
    }));
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return [];
  }
};

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    // Eski verileri temizle
    await Book.deleteMany({});
    console.log('Existing books removed');

    // API'den kitapları çek
    const booksFromAPI = await fetchBooksFromAPI();

    if (booksFromAPI.length === 0) {
      console.log('No books fetched from API, seeding aborted.');
      process.exit(1);
    }

    // DB'ye ekle
    await Book.insertMany(booksFromAPI);
    console.log(`${booksFromAPI.length} books inserted successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedBooks();
