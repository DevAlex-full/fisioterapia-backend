import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl        = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================================
// Garante que o bucket existe e é público
// ============================================================
export async function ensureBucket(bucket: string): Promise<void> {
  const { error } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'image/gif', 'image/heic', 'image/heif',
      'video/mp4', 'video/webm', 'video/mov', 'video/quicktime',
    ],
  });
  // Ignora erro se bucket já existe
  if (error && !error.message.toLowerCase().includes('already exists')) {
    console.warn(`⚠️  Aviso ao criar bucket "${bucket}":`, error.message);
  }
}

// ============================================================
// Upload de arquivo para o Storage
// ============================================================
export async function uploadToStorage(
  bucket:   string,
  path:     string,
  file:     Buffer,
  mimeType: string
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Falha no Supabase Storage: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ============================================================
// Deletar arquivo do Storage
// ============================================================
export async function deleteFromStorage(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Erro ao deletar: ${error.message}`);
}