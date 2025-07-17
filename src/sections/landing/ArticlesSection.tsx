import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { trendingArticles, Article } from '@/data/articles';

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="flex flex-col w-[300px] sm:w-[360px] lg:w-[418.67px] flex-shrink-0">
      <div className="relative w-full h-[200px] sm:h-[240px] lg:h-[280px] rounded-lg overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-white text-base sm:text-lg font-medium leading-snug sm:leading-7">
          {article.title}
        </h3>
        <p className="text-white text-xs sm:text-sm mt-2 underline">
          {article.date}
        </p>
      </div>
    </div>
  );
};

const ArticlesSection: React.FC = () => {
  return (
    <section className="w-full bg-[#1A1A1A] py-12 sm:py-16 lg:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4 sm:mb-0">
            Top 10 Trending Articles This Week
          </h2>
          <Link 
            href="/articles"
            className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
          >
            See All
          </Link>
        </div>
        
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex gap-4 sm:gap-7 overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8 scrollbar-hide">
          {trendingArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
