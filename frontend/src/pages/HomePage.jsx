import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from "framer-motion"
import { BookOpen, Calendar, Search, TrendingUp } from "lucide-react"

const HomePage = () => {
    const navigate = useNavigate();
    const { authUser, checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            await checkAuth();
            setLoading(false);
        };
        getUser();
    }, [checkAuth]);

    const handleMentor = () => {
        if (authUser?.role === 'mentor') {
            navigate('/request-fetch');
        } else if (authUser?.role === 'mentee') {
            navigate('/mentor-fetch');
        } else {
            navigate('/login');
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }
    
      const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
      }
    

    if (loading) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Learn from Top Mentors
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Get personalized mentorship from IIT, NIT, and IIIT students to accelerate your career growth
          </p>

          <button
            onClick={authUser ? handleMentor : () => navigate("/login")}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-medium px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {authUser ? (authUser.role === "mentor" ? "Check Requests" : "Find Mentors") : "Get Started"}
          </button>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Search, title: "Find Your Mentor", desc: "Browse and connect with top mentors from IITs, NITs, and IIITs." },
              { icon: Calendar, title: "Schedule Sessions", desc: "Book 1-on-1 sessions for mentorship and interview preparation." },
              { icon: BookOpen, title: "Access Resources", desc: "Get curated study materials and structured learning paths." },
              { icon: TrendingUp, title: "Track Progress", desc: "Follow guided learning to achieve your dream job or goals." },
            ].map(({ icon: Icon, title, desc }, index) => (
              <motion.div variants={item} key={index}>
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg text-center shadow-md hover:bg-slate-700/50 transition-all">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-slate-300 mt-2">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
    );
};

export default HomePage;