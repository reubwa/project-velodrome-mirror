/* eslint-disable @typescript-eslint/no-explicit-any */
import Loki from "@lokidb/loki";
import { type TiplocData, TiplocLoader } from "./tiplocLoader";

class Data {
	// Lazy-loaded singleton instance of a Loki data store.
	private static Datastore_Singleton: Loki | null = null;

	// Fetches data store singleton.
	public static GetStore() {
		if (this.Datastore_Singleton == null) this.Datastore_Singleton = new Loki("main.db");
		return this.Datastore_Singleton;
	}

	public static async GetTiplocs(db: Loki) {
		let store = db.getCollection("tiploc");
		// Lazy-load tiploc data if not available
		if (!store) {
			store = db.addCollection("tiploc", { indices: ["Tiploc", "Name"] } as any);
			await TiplocLoader.LoadTiplocData().then(v => {
				console.log(`insert ${v.length} tiplocs into db...`);
				store.insert(v);
			});
		}
		return store;
	}

	// Run todo callback on all tiplocs.
	public static async ForAllTiplocs(todo: (v: TiplocData) => void): Promise<number> {
		return this.ForAllMatchingTiplocs(todo, {});
	}

	// Run todo callback on all tiplocs that match the following constraint. Constraint is in MongoDB syntax.
	public static async ForAllMatchingTiplocs(todo: (v: TiplocData) => void, constraint: any): Promise<number> {
		const db = this.GetStore();

		const store = await this.GetTiplocs(db);
		if (!store) return 0;

		const filtered = store.chain().find(constraint).data();

		console.log(`Found ${filtered.length} tiplocs!!`);

		(filtered as any).forEach(todo);

		return filtered.length;
	}

	// Collect tiploc data by ID.
	public static async GetTiploc(tiploc: string): Promise<TiplocData | null> {
		const db = this.GetStore();

		// block until substore is present for looking up tiplocs
		const store = await this.GetTiplocs(db);
		if (!store) return null;

		// Collect tiploc data at location;
		return store.findOne({ Tiploc: tiploc } as any) as any;
	}
}

export { Data };