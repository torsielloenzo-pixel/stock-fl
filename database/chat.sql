-- Messagerie équipe Netto
-- À exécuter une seule fois dans l'éditeur SQL Supabase.

create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  body text,
  attachment_path text,
  attachment_name text,
  attachment_type text,
  attachment_size bigint,
  created_at timestamptz not null default now(),
  constraint chat_message_content check (body is not null or attachment_path is not null)
);

alter table public.chat_messages enable row level security;

drop policy if exists "chat_read_authenticated" on public.chat_messages;
create policy "chat_read_authenticated"
on public.chat_messages for select
to authenticated
using (true);

drop policy if exists "chat_insert_own" on public.chat_messages;
create policy "chat_insert_own"
on public.chat_messages for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "chat_admin_delete" on public.chat_messages;
create policy "chat_admin_delete"
on public.chat_messages for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

insert into storage.buckets (id,name,public,file_size_limit)
values ('chat-files','chat-files',false,26214400)
on conflict (id) do update set public=false,file_size_limit=26214400;

drop policy if exists "chat_files_read" on storage.objects;
create policy "chat_files_read"
on storage.objects for select
to authenticated
using (bucket_id='chat-files');

drop policy if exists "chat_files_upload" on storage.objects;
create policy "chat_files_upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id='chat-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "chat_files_admin_delete" on storage.objects;
create policy "chat_files_admin_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id='chat-files'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Active les changements temps réel si la table n'est pas déjà publiée.
do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception
  when duplicate_object then null;
end $$;
