import { FormEvent, useState } from 'react';
import { Seo } from '../lib/seo';
import { submitSuggestion } from '../services/suggestionService';
import type { SuggestionInput, SuggestionType } from '../types/content';

const requestTypes: Array<{ value: SuggestionType; label: string }> = [
  { value: 'song', label: 'Запропонувати пісню' },
  { value: 'mistake', label: 'Повідомити про неточність' },
  { value: 'better_translation', label: 'Запропонувати кращий переклад' },
  { value: 'contact', label: 'Зв’язатися з автором' },
];

export default function ContactPage() {
  const [form, setForm] = useState<SuggestionInput>({ type: 'song', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Перевірте email або залиште поле порожнім.');
      setStatus('error');
      return;
    }

    if (form.message.trim().length < 10) {
      setError('Напишіть трохи більше деталей.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await submitSuggestion({ ...form, message: form.message.trim() });
      setStatus('success');
      setForm({ type: 'song', message: '' });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не вдалося надіслати повідомлення.');
      setStatus('error');
    }
  }

  return (
    <>
      <Seo
        title="Контакти | KANYE in Ukrainian"
        description="Запропонуйте пісню, повідомте про неточність або напишіть автору KANYE in Ukrainian."
        path="/contact"
      />
      <section className="contact-page">
        <h1>Контакти</h1>
        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            Ім’я
            <input
              value={form.name ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              value={form.email ?? ''}
              type="email"
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              autoComplete="email"
            />
          </label>
          <label>
            Тип звернення
            <select
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as SuggestionType }))}
            >
              {requestTypes.map((type) => (
                <option value={type.value} key={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Пісня або посилання
            <input
              value={form.song_reference ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, song_reference: event.target.value }))}
            />
          </label>
          <label>
            Повідомлення
            <textarea
              value={form.message}
              required
              rows={6}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            />
          </label>
          <button className="plain-button" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Надсилання...' : 'Надіслати'}
          </button>
          {status === 'success' ? <p className="state-text">Дякую. Повідомлення надіслано.</p> : null}
          {status === 'error' ? <p className="state-text state-text--error">{error}</p> : null}
        </form>
      </section>
    </>
  );
}
