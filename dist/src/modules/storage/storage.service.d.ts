export declare class StorageService {
    private supabase;
    constructor();
    uploadFile(bucket: string, path: string, fileBuffer: Buffer, mimeType: string): Promise<string>;
}
