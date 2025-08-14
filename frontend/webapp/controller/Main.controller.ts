import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace buecherverwaltung.app.controller
 */
export default class Main extends BaseController {

	public onInit(): void {
		void this.loadBooks();
	}

	private async loadBooks(): Promise<void> {
		try {
			const response: Response = await fetch("http://localhost:3000/api/books");

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			
			const books: unknown = await response.json();

			const booksModel = this.getView().getModel("booksModel") as JSONModel;
			booksModel.setProperty("/books", books);
		} catch (error) {
			console.error("Error loading books:", error);
		}
	}
}
