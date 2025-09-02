'use server';

import { createActionClient } from '@/utils/supabase/actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function createNote(formData) {
  const supabase = await createActionClient();

  // Get current user (required to set user_id and pass RLS)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();

  if (!title) {
    throw new Error('Must have title!')
  }

  const { error } = await supabase
    .from('notes')
    .insert([{ user_id: user.id, title, content }]);

  if (error) {
    throw error
  }

  revalidatePath('/dashboard');
}

export async function updateNote(formData){
  const supabase = await createActionClient();
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '');
  const content = String(formData.get('content') || '');

  if (!id || !title) redirect(`/notes/${id}`);
  await supabase.from('notes').update({title,content}).eq('id', id).eq('user_id', user.id)

  revalidatePath('dashboard');
  revalidatePath(`/notes/${id}`);
}

export async function deleteNote(formData){
  const supabase = await createActionClient();
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(formData.get('id') || '');
  if (!id) redirect('/dashboard');
  await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('dashboard');
  redirect('/dashboard');
}

async function callLLM({apiKey, content}){
  const prompt = `Summarize the following note in 2–3 concise sentences. Focus on key points and next steps if any.\n\n${(content || '').slice(0, 3000)}`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {role: 'system', content: 'You are a concise assistant.'},
        {role: 'user', content: prompt}
      ],
      temperature: .2,
      max_tokens: 180
    })
  })

  if (!res.ok){
    console.error('OpenAi Error', res)
    throw new Error('LLM request failed')
  }

  const json = await res.json();
  return json.choices?.[0].message?.content?.trim() || '';
}

export async function summarizeNote(formData){
  const supabase = await createActionClient();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(formData.get('id') || '');
  if (!id) return;
  const {data: note} = await supabase.from('notes').select('id, user_id, content, summarized_at').eq('id', id).single();
  if (!note || note.user_id !== user.id) return;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return;
  const summary = await callLLM({apiKey, content: note.content})
  await supabase.from('notes').update({summary, summarized_at: new Date().toISOString()}).eq('id', id).eq('user_id', user.id);
  revalidatePath('/dashboard')
  revalidatePath(`/notes/${id}`)
}