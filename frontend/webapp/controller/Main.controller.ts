import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input from "sap/m/Input";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace buecherverwaltung.app.controller
 */

export default class Main extends BaseController {

	public onInit(): void {
		void this.loadBooks();
	}

	private async loadBooks(startDate?: Date, endDate?: Date): Promise<void> {
    try {
        let url = "http://localhost:3000/api/books";
        if (startDate && endDate) {
            url += `?date=${startDate.toISOString()}_${endDate.toISOString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const books: unknown = await response.json();
        const booksModel = this.getView().getModel("booksModel") as JSONModel;
        booksModel.setProperty("/books", books);
    } catch (error) {
        console.error("Error loading books:", error);
    }
	}

	public onAddBook(): void {
		const title = (this.byId("titleInput") as Input).getValue();
		const author = (this.byId("authorInput") as Input).getValue();
		const createdBy = (this.byId("createdByInput") as Input).getValue();

		if (!title || !author || !createdBy) {
			MessageToast.show("Bitte für alle Felder ausfüllen.");
			return;
		}

		fetch("http://localhost:3000/api/books", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ title, author, createdBy })
		})
		.then(res => {
				if (!res.ok) throw new Error("Buch konnte nicht hinzugefügt werden");
				return res.json();
		})
		.then(async () => {
				MessageToast.show("Buch hinzugefügt!");
				await this.loadBooks(); // Refresh the table
				// Clear input fields
				(this.byId("titleInput") as Input).setValue("");
				(this.byId("authorInput") as Input).setValue("");
				(this.byId("createdByInput") as Input).setValue("");
		})
		.catch(err => {
				console.error(err);
				MessageToast.show("Fehler beim Hinzufügen des Buches.");
		});
  }
}
