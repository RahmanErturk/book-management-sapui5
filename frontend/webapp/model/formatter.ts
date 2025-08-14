export default {
	formatValue: (value: string) => {
		return value?.toUpperCase();
	},

	formatDate: (dateString: string) => {
		if (!dateString) {
			return "";
		}

		const date = new Date(dateString);

		// Eğer geçersiz tarih ise boş döndür
		if (isNaN(date.getTime())) {
			return "";
		}

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}.${month}.${year}`;
	}
};
