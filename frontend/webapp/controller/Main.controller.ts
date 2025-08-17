import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input from "sap/m/Input";
import MessageToast from "sap/m/MessageToast";
import ColumnListItem from "sap/m/ColumnListItem";
import Event from "sap/ui/base/Event";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import DatePicker from "sap/m/DatePicker";
import Filter from "sap/ui/model/Filter";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace buecherverwaltung.app.controller
 */

interface IBook {
  title: string;
  author: string;
  createdBy: string;
  _id: string;
  createdAt: string;
  __v: number;
}

export default class Main extends BaseController {

	public onInit(): void {
		void this.loadBooks();

		this.getRouter().getRoute("main")?.attachPatternMatched(() => {
			void this.loadBooks();
		}, this);
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

	private _editDialog: Dialog | null = null;
	private _editingBookId: string | null = null;

	public async onEditBook(oEvent: Event): Promise<void> {
    const oButton = oEvent.getSource();
    const oListItem = oButton.getEventingParent() as ColumnListItem;
    const oContext = oListItem.getBindingContext("booksModel");

    if (!oContext) {
        MessageToast.show("Kontext konnte nicht ermittelt werden.");
        return;
    }

    const bookData = oContext.getObject() as IBook;
    this._editingBookId = bookData._id;

		if (!this._editDialog) {
			this._editDialog = (await Fragment.load({
				id: this.getView().getId(), // Add ID prefix
				name: "buecherverwaltung.app.view.EditBookDialog",
				controller: this
			})) as Dialog;
			this.getView().addDependent(this._editDialog);
		}

		// Set current values to Inputs
		(this.byId("editTitleInput") as Input).setValue(bookData.title);
		(this.byId("editAuthorInput") as Input).setValue(bookData.author);
		(this.byId("editCreatedByInput") as Input).setValue(bookData.createdBy);

    this._editDialog.open();
	}

	public onSaveEditedBook(): void {
		const title = (this.byId("editTitleInput") as Input).getValue();
		const author = (this.byId("editAuthorInput") as Input).getValue();
		const createdBy = (this.byId("editCreatedByInput") as Input).getValue();

		if (!this._editingBookId) {
				MessageToast.show("Kein Buch zum Bearbeiten ausgewählt.");
				return;
		}

		if (!title || !author || !createdBy) {
				MessageToast.show("Bitte füllen Sie alle Felder aus.");
				return;
		}

		fetch(`http://localhost:3000/api/books/${this._editingBookId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, author, createdBy })
		})
		.then(res => {
				if (!res.ok) throw new Error("Fehler beim Aktualisieren");
				return res.json();
		})
		.then(async () => {
				MessageToast.show("Buch aktualisiert!");
				this._editDialog?.close();
				await this.loadBooks();
		})
		.catch(err => {
				console.error(err);
				MessageToast.show("Fehler beim Speichern des Buches.");
		});
  }

	public onCancelEdit(): void {
    this._editDialog?.close();
  }

	public onFilterByDate(): void {
		const startDate = (this.byId("startDatePicker") as DatePicker).getDateValue();
		const endDate = (this.byId("endDatePicker") as DatePicker).getDateValue();

		if (!startDate || !endDate) {
			MessageToast.show("Bitte füllen Sie alle Felder aus.");
			return;
		}

		void this.loadBooks(startDate, endDate);
	}

	public _onFilterByDate(): void {
		const startDate = (this.byId("startDatePicker") as DatePicker).getDateValue();
		const endDate = (this.byId("endDatePicker") as DatePicker).getDateValue();

		if (!startDate || !endDate) {
			MessageToast.show("Bitte füllen Sie alle Felder aus.");
			return;
		}

		const table = this.byId("booksTable");
		const binding = table.getBinding("items") as ListBinding;

    const dateFilter = new Filter({
			path: "createdAt",
			test: (date: string) => {
				const bookDate = new Date(date);
				return bookDate >= startDate && bookDate <= endDate;
			}	
		});

		binding?.filter([dateFilter]);
	}

	public onNavToAdd(): void {
		this.getRouter().navTo("bookAdd");
	}

}