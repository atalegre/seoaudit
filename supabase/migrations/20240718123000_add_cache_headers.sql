
-- Adicionar configuração para armazenar recursos estáticos com cache
ALTER STORAGE.buckets 
UPDATE SET public_url_transform_config = 
  '{"max-age": 604800, "stale-while-revalidate": 86400}' -- 7 dias de cache + 1 dia de stale-while-revalidate
WHERE name = 'blog-images';

-- Configurar CORS headers para otimização
INSERT INTO storage.policies (name, definition, policies)
VALUES (
  'Content-Security-Policy',
  '{"Statement": [{"Effect": "Allow", "Principal": "*", "Action": "storage:*", "Resource": ["blog-images/*"]}]}',
  '{"cache-control": "public, max-age=604800, immutable", "content-encoding": "gzip"}'
);

-- Adicionar regras de cache especialmente para conteúdo de imagens
INSERT INTO storage.policies (name, definition, policies)
VALUES (
  'Image-Optimization-Policy',
  '{"Statement": [{"Effect": "Allow", "Principal": "*", "Action": "storage:*", "Resource": ["*/*.jpg", "*/*.png", "*/*.webp", "*/*.svg"]}]}',
  '{"cache-control": "public, max-age=31536000, immutable", "content-encoding": "gzip", "vary": "Accept-Encoding"}'
);

-- Configurar regras adicionais para compressão
ALTER STORAGE.buckets 
ADD compression = true
WHERE name IN ('blog-images');
