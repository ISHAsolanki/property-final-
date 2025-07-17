"use client";
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUser, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/articles`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.articles.find((a: any) => a._id === id);
          setArticle(found);
        }
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#181818] text-white">
        {/* Hero Section */}
        <div className="relative w-full aspect-[16/5] bg-black flex items-end justify-start">
          {article && (article.coverImage?.data || article.coverImage?.url || (article.images && article.images[0] && (article.images[0].data || article.images[0].url))) && (
            <Image
              src={article.coverImage?.data || article.coverImage?.url || article.images[0]?.data || article.images[0]?.url}
              alt={article.coverImage?.name || article.title}
              fill
              className="object-cover opacity-80"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818cc] to-transparent" />
          <div className="relative z-10 p-8 md:p-16 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {article?.title || 'Loading...'}
            </h1>
            <div className="flex items-center gap-4 text-gray-300 text-sm mb-2">
              <span className="flex items-center gap-2">
                <FaUser className="w-5 h-5 rounded-full bg-white/20 p-1" />
                <span className="font-medium">{article?.author}</span>
              </span>
              <span className="mx-3 h-6 border-l border-white/30" />
              <span className="flex items-center gap-2">
                <FaRegCalendarAlt className="w-5 h-5" />
                <span>{article?.date}</span>
              </span>
              <span className="mx-3 h-6 border-l border-white/30" />
              <span className="flex items-center gap-2">
                <FaRegClock className="w-5 h-5" />
                <span>{article?.readTime}</span>
              </span>
            </div>
          </div>
        </div>
        {/* Article Body */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : !article ? (
            <div className="text-gray-400">Article not found.</div>
          ) : (
            <>
              {article.content && article.content.map((para: string, idx: number) => (
                <p key={idx} className="mb-6 text-gray-200 whitespace-pre-line">{para}</p>
              ))}
              {article.images && article.images.length > 0 && (
                <div className="w-full flex flex-wrap gap-6 my-10">
                  {article.images.map((img: any, idx: number) => (
                    <div key={idx} className="flex-1 min-w-[300px] max-w-[400px]">
                      <Image
                        src={img.data || img.url}
                        alt={img.name || article.title}
                        width={400}
                        height={250}
                        className="rounded-lg object-cover w-full h-[250px]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 