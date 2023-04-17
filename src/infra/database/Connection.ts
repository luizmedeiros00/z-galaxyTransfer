export default interface Connection {
	query (statement: string, params: any): Promise<any>;
	one(query: string, values?: any[]): Promise<any>;
	close (): Promise<void>;
}