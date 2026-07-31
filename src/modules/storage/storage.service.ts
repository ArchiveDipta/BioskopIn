import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://dummy.supabase.co',
      process.env.SUPABASE_KEY || 'dummy_key'
    );
  }

  async uploadFile(bucket: string, path: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error('Supabase Upload Error:', error);
      throw new InternalServerErrorException('Gagal mengunggah foto ke Supabase');
    }

    const { data: publicUrlData } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrlData.publicUrl;
  }
}
