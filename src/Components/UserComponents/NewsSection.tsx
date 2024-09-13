import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { RiArticleLine } from "react-icons/ri";
import { motion } from "framer-motion";
import logo from "@/assets/bg-2.jpg";
const news = [
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Lauren Forristal",
    title:
      "Bye-bye bots: Altera's game-playing AI agents get backing from Eric Schmidt | TechCrunch",
    description:
      "Autonomous, AI-based players are coming to a gaming experience near you, and a new startup, Altera, is joining the fray to build this new guard of AI Research company Altera raised $9 million to build AI agents that can play video games alongside other player…",
    url: "https://techcrunch.com/2024/05/08/bye-bye-bots-alteras-game-playing-ai-agents-get-backing-from-eric-schmidt/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/Minecraft-keyart.jpg?resize=1200,720",
    publishedAt: "2024-05-08T15:14:57Z",
    content:
      "Autonomous, AI-based players are coming to a gaming experience near you, and a new startup, Altera, is joining the fray to build this new guard of AI agents.\r\nThe company announced Wednesday that it … [+6416 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Alex Wilhelm and Theresa Loconsolo",
    title:
      "$450M for Noname, two billion-dollar rounds, and good news for crypto startups | TechCrunch",
    description:
      "This morning on Equity, not only do we have good news for crypto founders, we're also digging into Akamai spending $450 million for API security firm Noname, and billion dollar deals from Wiz and Wayve.",
    url: "https://techcrunch.com/2024/05/08/450m-for-noname-two-billion-dollar-rounds-and-good-news-for-crypto-startups/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2023/07/GettyImages-942480316.jpg?resize=1200,835",
    publishedAt: "2024-05-08T15:01:51Z",
    content:
      "Good news, crypto founders: Venture capital activity is picking up in your sector after falling to multi-year lows in late 2023. Put another way, venture folks appear more web3-bullish than before, e… [+1599 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Alex Wilhelm",
    title: "Watch: When did iPads get as expensive as MacBooks?",
    description:
      "Would you switch out your MacBook for an iPad with an M4 chip and OLED display? With the increase in price, Apple seems to be arguing these are comparable but we’re curious to see if consumers will make the change.",
    url: "https://techcrunch.com/2024/05/08/techcrunch-minute-when-did-ipads-get-as-expensive-as-macbooks/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/ipad-noplay.png?resize=1200,675",
    publishedAt: "2024-05-08T14:52:26Z",
    content:
      "Apple’s iPad event had a lot to like. New iPads with new chips and new sizes, a new Apple Pencil, and even some software updates. If you are a big fan of Apple hardware, well, it was probably a good … [+1385 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Rebecca Bellan",
    title:
      "Uber promises member exclusives as Uber One passes $1B run-rate | TechCrunch",
    description:
      "Uber plans to deliver more perks to Uber One members, like member-exclusive events, in a bid to gain more revenue through subscriptions.  “You will see",
    url: "https://techcrunch.com/2024/05/08/uber-promises-member-exclusives-as-uber-one-passes-1b-run-rate/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2023/05/GettyImages-1142304853-a.jpg?resize=1200,675",
    publishedAt: "2024-05-08T14:41:36Z",
    content:
      "Uber plans to deliver more perks to Uber One members, like member-exclusive events, in a bid to gain more revenue through subscriptions. \r\nYou will see more member-exclusives coming up where members … [+4676 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Mike Butcher",
    title:
      "Checkfirst raises $1.5M pre-seed, applying AI to remote inspections and audits | TechCrunch",
    description:
      "Checkfirst enables businesses to schedule inspectors based on geographical location and qualifications, in addition to allowing for remote inspections.",
    url: "https://techcrunch.com/2024/05/08/checkfirst-raises-1-5m-pre-seed-applying-ai-to-remote-inspections-and-audits/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/Checkfirst-team.jpg?w=960",
    publishedAt: "2024-05-08T13:02:12Z",
    content:
      "Weve all seen them. The inspector with a clipboard, walking around a building, ticking off the last time the fire extinguishers were checked, or if all the lights are working. They work in the TICC (… [+3279 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Paul Sawers",
    title:
      "UK challenger bank Monzo nabs another $190M as US expansion beckons | TechCrunch",
    description:
      "Monzo has raised another $190 million, as the challenger bank looks to expand its presence internationally — particularly in the U.S.",
    url: "https://techcrunch.com/2024/05/08/uk-challenger-bank-monzo-nabs-another-190m-at-5-2b-valuation/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/GettyImages-1259121938-e1715164252704.jpg?resize=1200,676",
    publishedAt: "2024-05-08T12:34:05Z",
    content:
      "Monzo has raised another £150 million ($190 million), as the challenger bank looks to expand its presence internationally particularly in the U.S.\r\nThe new round comes just two months after Monzo rai… [+1960 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Brian Heater",
    title: "iRobot names former Timex head Gary Cohen as CEO | TechCrunch",
    description:
      "iRobot Tuesday announced the successor to longtime CEO, Colin Angle. Gary Cohen, who previous held chief executive role at Timex and Qualitor Automotive,",
    url: "https://techcrunch.com/2024/05/08/irobot-names-former-timex-head-gary-cohen-as-ceo/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/Screenshot-2024-05-08-at-7.19.50 AM.jpg?resize=1200,919",
    publishedAt: "2024-05-08T12:22:30Z",
    content:
      "iRobot Tuesday announced the successor to longtime CEO, Colin Angle. Gary Cohen, who previous held chief executive role at Timex and Qualitor Automotive, will be heading up the company, marking a maj… [+2120 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Devin Coldewey",
    title:
      "Google Deepmind debuts huge AlphaFold update and free proteomics-as-a-service web app | TechCrunch",
    description:
      "Google Deepmind has taken the wraps off a new version AlphaFold, their transformative machine learning model that predicts the shape and behavior of",
    url: "https://techcrunch.com/2024/05/08/google-deepmind-debuts-huge-alphafold-update-and-free-proteomics-as-a-service-web-app/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/alphafold-3-deepmind.jpg?resize=1200,675",
    publishedAt: "2024-05-07T22:10:14Z",
    content:
      "Google Deepmind has taken the wraps off a new version AlphaFold, their transformative machine learning model that predicts the shape and behavior of proteins. AlphaFold 3 is not only more accurate, b… [+7069 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Tim De Chant",
    title:
      "Mycocycle uses mushrooms to upcycle old tires and construction waste | TechCrunch",
    description:
      "The startup's fungi use their mycelium to consume oil-based rubbers and plastics, creating new bio-based materials in the process.",
    url: "https://techcrunch.com/2024/05/08/mycocycle-uses-mushrooms-to-upcycle-old-tires-and-construction-waste/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/GettyImages-1350655821.jpeg?resize=1200,796",
    publishedAt: "2024-05-07T18:07:09Z",
    content:
      "Usually, when something starts to rot, it gets pitched in the trash. But Joanne Rodriguez wants to turn the concept of rot on its head by growing fungus on trash to turn it into something better.\r\nWe… [+4229 chars]",
  },
  {
    source: {
      id: "techcrunch",
      name: "TechCrunch",
    },
    author: "Kyle Wiggers",
    title:
      "Controversial drone company Xtend leans into defense with new $40M round | TechCrunch",
    description:
      "Xtend, a drone company heavily involved with defense customers, has raised a new round of capital to expand its operations.",
    url: "https://techcrunch.com/2024/05/08/controversial-drone-company-xtend-leans-into-defense/",
    urlToImage:
      "https://techcrunch.com/wp-content/uploads/2024/05/wildfire_drone_web.jpg?w=900",
    publishedAt: "2024-05-07T18:01:34Z",
    content:
      "Close to a decade ago, brothers Aviv and Matteo Shapira co-founded Replay, a company that created a video format for 360-degree replays — the sorts of replays that have become part and parcel of majo… [+5398 chars]",
  },
];

const NewsSection = () => {
  const [articles, setArticles] = useState<any>([]);
  const [showArticles, setShowArticles] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile] = useState(window.innerWidth <= 640);
  const articlesPerPage = isMobile ? 1 : 4;

  const fetchNews = useCallback(async () => {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=2e5705f4d9bf4b27b316f696ff32e7c4`
    );

    setArticles(news);
    setShowArticles(news.slice(0, articlesPerPage));
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
    <section className="bg-gray-50 py-5">
      <motion.h1
        className="text-center text-4xl flex justify-center gap-4 font-semibold pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Whats Happening Around The World <RiArticleLine />
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
              className="bg-white shadow-sm rounded-md bg-cover overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <img
                src={article?.urlToImage}
                className="h-40 w-full object-cover"
              />
              <div className="flex-1 p-4">
                <h2 className="text-xl font-semibold mb-1 text-gray-800 hover:text-gray-500 transition-colors duration-200">
                  {article?.title}
                </h2>
                <p className="text-gray-500 text-sm mb-2">
                  {article?.author || "No description available"}
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-100 border-t border-gray-300">
                <motion.span
                  onClick={() => window.open(article?.url)}
                  className="text-gray-100 px-2 py-1 rounded-lg bg-[#6561b3] hover:bg-[#4c489e] font-medium transition-colors cursor-pointer duration-200"
                  title="Read more"
                  whileHover={{ scale: 1.1, backgroundColor: "#4c489e" }}
                  transition={{ duration: 0.3 }}
                >
                  Read More
                </motion.span>
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
