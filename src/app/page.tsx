'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Review = {
  id: number;
  author: string | null;
  product: string | null;
  rating: number | null;
  content: string | null;
  created_at: string | null;
};

export default function Page() {
  const [author, setAuthor] = useState('');
  const [product, setProduct] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [list, setList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) alert(error.message);
    setList(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!author || !product || !content) {
      alert('작성자/상품명/리뷰 내용을 입력하세요.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('reviews').insert([{ author, product, rating, content }]);
    if (error) alert(error.message);
    setAuthor(''); setProduct(''); setRating(5); setContent('');
    await load();
    setLoading(false);
  }

  async function handleEdit(r: Review) {
    const na = prompt('작성자', r.author ?? '') ?? r.author ?? '';
    const np = prompt('상품명', r.product ?? '') ?? r.product ?? '';
    const nr = Number(prompt('평점(1~5)', String(r.rating ?? 5)) ?? r.rating ?? 5);
    if (Number.isNaN(nr) || nr < 1 || nr > 5) return alert('평점은 1~5!');
    const nc = prompt('리뷰 내용', r.content ?? '') ?? r.content ?? '';

    const { error } = await supabase
      .from('reviews')
      .update({ author: na, product: np, rating: nr, content: nc })
      .eq('id', r.id);
    if (error) alert(error.message);
    await load();
  }

  async function handleDelete(id: number) {
    if (!confirm('정말 삭제할까요?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) alert(error.message);
    await load();
  }

  return (
    <>
      <h1 style={{fontSize:32, fontWeight:900, marginBottom:16}}>ReviewSpark</h1>

      <div className="card">
        <div className="row" style={{marginBottom:8}}>
          <input className="input" placeholder="작성자" value={author} onChange={e=>setAuthor(e.target.value)} />
        </div>
        <div className="row" style={{marginBottom:8}}>
          <input className="input" placeholder="상품명" value={product} onChange={e=>setProduct(e.target.value)} />
        </div>
        <div className="row" style={{marginBottom:8}}>
          <input className="input" placeholder="평점(1~5)" value={rating} onChange={e=>setRating(Number(e.target.value)||0)} />
        </div>
        <div className="row" style={{marginBottom:12}}>
          <textarea className="textarea" placeholder="리뷰 내용" rows={5} value={content} onChange={e=>setContent(e.target.value)} />
        </div>
        <button className="btn" onClick={handleCreate} disabled={loading}>
          {loading ? '등록 중…' : '리뷰 등록'}
        </button>
      </div>

      <h2 style={{margin:'24px 0 12px 0'}}>최근 리뷰</h2>
      {list.length === 0 && <div className="small">아직 리뷰가 없어요.</div>}
      {list.map(r => (
        <div key={r.id} className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{fontSize:18, fontWeight:700}}>{r.product}</div>
            <div className="star">★ {r.rating ?? '-'}</div>
          </div>
          <div className="small" style={{margin:'4px 0 8px 0'}}>
            by {r.author ?? '익명'} · {r.created_at ? new Date(r.created_at).toLocaleString() : ''}
          </div>
          <div>{r.content}</div>
          <div className="actions">
            <button className="action" onClick={()=>handleEdit(r)}>수정</button>
            <button className="action" onClick={()=>handleDelete(r.id)}>삭제</button>
          </div>
        </div>
      ))}
    </>
  );
}
