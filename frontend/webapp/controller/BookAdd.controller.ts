import BaseController from "./BaseController";
import Input from "sap/m/Input";
import MessageToast from "sap/m/MessageToast";

export default class BookAdd extends BaseController {
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
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(() => {
        MessageToast.show("Buch erfolgreich hinzugefügt.");
        this.getRouter().navTo("main");
      })
      .catch(error => {
        console.error("Error adding book:", error);
        MessageToast.show("Fehler beim Hinzufügen des Buches.");
      });
  }

  public onNavBack(): void {
    this.getRouter().navTo("main");
  }
}