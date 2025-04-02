
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
  '{"cache-control": "public, max-age=604800, immutable"}'
);
