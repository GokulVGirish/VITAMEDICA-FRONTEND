import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { GrLinkNext, GrLinkPrevious} from "react-icons/gr";
import { RiArticleLine } from "react-icons/ri";
import { motion } from "framer-motion";
import logo from '@/assets/bg-2.jpg';

const NewsSection = () => {
  const [articles, setArticles] = useState<any>([]);
  const [showArticles, setShowArticles] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 4;

  const fetchNews = useCallback(async () => {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=2e5705f4d9bf4b27b316f696ff32e7c4`
    );
    setArticles(response.data.articles);
    setShowArticles(response.data.articles.slice(0, articlesPerPage));
    setTotalPages(Math.ceil(response.data.articles.length / articlesPerPage));
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    setShowArticles(articles.slice(startIndex, endIndex));
  }, [page, articles]);

  return (
    <section className="bg-gray-50 py-8">
      <motion.h1
        className="text-center text-4xl flex justify-center gap-4 font-semibold pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Health Articles <RiArticleLine />
      </motion.h1>
      <div className="container mx-auto flex items-center gap-2 px-4 md:px-8">
        {page !== 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GrLinkPrevious
              onClick={() => {
                if (page > 1) {
                  setPage((prevState) => prevState - 1);
                }
              }}
              size={40}
              className="cursor-pointer"
            />
          </motion.div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {showArticles?.map((article: any, index: any) => (
            <motion.div
              style={{
                backgroundImage: `url(${logo})`,
              }}
              className="bg-white shadow-sm rounded-md bg-cover overflow-hidden flex flex-col"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex-1 p-4">
                <h2 className="text-xl font-semibold mb-1 text-gray-800 hover:text-gray-500 transition-colors duration-200">
                  {article?.title}
                </h2>
                <p className="text-gray-500 text-sm mb-2">
                  {article?.author || "No description available"}
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-100 border-t border-gray-300">
                <span
                  onClick={() => window.open(article?.url)}
                  className="text-gray-100 px-2 py-1 rounded-lg bg-[#6561b3] hover:text-[#6561b3] font-medium transition-colors cursor-pointer duration-200"
                  title="Read more"
                >
                  Read More
                </span>
                <span className="text-gray-400 text-xs">
                  {moment(article?.publishedAt).format("MMM D, YYYY")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        {page < totalPages && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GrLinkNext
              onClick={() => {
                if (page < totalPages) {
                  setPage((prevState) => prevState + 1);
                }
              }}
              size={40}
              className="cursor-pointer"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
