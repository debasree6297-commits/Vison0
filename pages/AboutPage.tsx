import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageSquare, Image as ImageIcon, Sparkles, Zap, Feather, ArrowLeft } from 'lucide-react';
import ScrollReveal, { EASE_OUT } from '../components/ScrollReveal';
import Logo from '../components/icons/Logo';
import { useNavigate } from 'react-router-dom';

// FIX: Refactored from `React.FC` to a standard function to resolve framer-motion type errors.
const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 pt-32 min-h-screen">
      <ScrollReveal>
        <div className="text-center mb-20">
          <Logo className="h-24 w-24 text-default-accent-gold mx-auto" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-6">
            About Vision
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-default-text-secondary dark:text-space-text-secondary font-medium">
            Your Partner in Creative Excellence.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-24">
        {/* What is Vision? */}
        <ScrollReveal>
          <div className="glass-card p-10 md:p-12 rounded-[40px] border border-default-border dark:border-space-border shadow-xl">
            <div className="flex items-center gap-5 mb-6">
              <BrainCircuit size={36} className="text-default-accent-gold" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What is Vision?</h2>
            </div>
            <p className="text-lg text-default-text-secondary dark:text-space-text-secondary leading-relaxed font-medium">
              Vision is a next-generation AI-powered creative platform designed for creators, innovators, and dreamers. We bridge the gap between imagination and reality, providing a seamless, intuitive, and powerful suite of tools to bring your ideas to life with unparalleled speed and quality.
            </p>
          </div>
        </ScrollReveal>

        {/* Features */}
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">Our Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={MessageSquare}
              title="Chat Studio"
              description="Go beyond simple conversation. Our Chat Studio is a sophisticated partner for writing, brainstorming, and problem-solving. It understands context, refines your thoughts, and helps you generate high-quality text for any purpose, from scripts to marketing copy."
            />
            <FeatureCard
              icon={ImageIcon}
              title="Image Studio"
              description="Turn words into breathtaking visuals. The Image Studio uses state-of-the-art AI to generate stunning, high-fidelity images from your text descriptions. Create anything from photorealistic scenes to abstract art in seconds."
            />
          </div>
        </ScrollReveal>

        {/* How It Works */}
        <section>
            <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">A Simple Path to Brilliance</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {howItWorksSteps.map((step, i) => (
                    <motion.div
                        key={step.title}
                        // FIX: Converted to use variants to resolve TypeScript inference errors with the transition prop.
                        variants={howItWorksVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={i}
                        viewport={{ once: true, amount: 0.5 }}
                        className="glass-card p-6 rounded-3xl border border-default-border dark:border-space-border h-full"
                    >
                        <div className="w-16 h-16 bg-default-accent-gold rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg">
                            {step.num}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                        <p className="text-sm text-default-text-secondary">{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Why Choose Us */}
        <section>
            <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">Why Choose Vision?</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseUsItems.map((item, i) => (
                     <motion.div
                        key={item.title}
                        // FIX: Converted to use variants to resolve TypeScript inference errors with the transition prop.
                        variants={whyChooseUsVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={i}
                        viewport={{ once: true, amount: 0.5 }}
                        className="glass-card p-8 rounded-3xl border border-default-border dark:border-space-border flex items-start gap-5 h-full"
                    >
                        <div className="p-3 bg-default-accent-gold/10 rounded-xl text-default-accent-gold shrink-0">
                            <item.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                            <p className="text-default-text-secondary">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
      </div>

       {/* Go Back Button */}
      <div className="mt-24 text-center">
        <ScrollReveal>
          <motion.button 
            onClick={() => navigate(-1)} 
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-default-accent-gold text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
          >
            <ArrowLeft size={24} />
            <span>Go Back</span>
          </motion.button>
        </ScrollReveal>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  // FIX: Changed icon type from React.ElementType to a more specific React.ComponentType to resolve type errors.
  icon: React.ComponentType<{ size?: number; className?: string; }>;
  title: string;
  description: string;
}

// FIX: Refactored from `React.FC` to a standard function with typed props to resolve framer-motion type errors.
const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="glass-card p-8 h-full rounded-[32px] border border-default-border dark:border-space-border group hover:border-default-accent-gold/50 shadow-sm"
  >
    <div className="p-4 bg-default-accent-gold/10 dark:bg-space-accent-cyan/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 mb-6">
      <Icon size={40} className="text-default-accent-gold dark:text-space-accent-cyan" />
    </div>
    <h3 className="text-2xl font-extrabold mb-4 tracking-tight">{title}</h3>
    <p className="text-md text-default-text-secondary dark:text-space-text-secondary leading-relaxed font-medium">{description}</p>
  </motion.div>
);

// FIX: Added explicit types for the array items to resolve a TypeScript inference issue where properties were incorrectly being assigned the 'never' type.
interface HowItWorksStep {
    num: string;
    title: string;
    desc: string;
}

const howItWorksSteps: HowItWorksStep[] = [
    { num: '01', title: 'Choose Studio', desc: 'Select the right tool for your task—Chat or Image.' },
    { num: '02', title: 'Describe Vision', desc: 'Provide a clear prompt in natural language.' },
    { num: '03', title: 'Witness Magic', desc: 'Our AI generates exceptional results in seconds.' },
    { num: '04', title: 'Refine & Export', desc: 'Iterate on the output and download your masterpiece.' },
];

// FIX: Animation variants for the "How It Works" section.
const howItWorksVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE_OUT,
    },
  }),
};

interface WhyChooseUsItem {
    // FIX: Changed icon type from React.ElementType to a more specific React.ComponentType to resolve type errors.
    icon: React.ComponentType<{ size?: number; className?: string; }>;
    title: string;
    desc: string;
}

const whyChooseUsItems: WhyChooseUsItem[] = [
    { icon: Feather, title: 'Flawless Design', desc: 'An interface that is as beautiful as it is functional.' },
    { icon: Sparkles, title: 'Powerful AI', desc: 'Leverage cutting-edge models for superior quality.' },
    { icon: Zap, title: 'Seamless Workflow', desc: 'An integrated experience from idea to final product.' },
    { icon: BrainCircuit, title: 'Built For You', desc: 'Whether a solo creator or a team, Vision scales with you.' },
];

// FIX: Animation variants for the "Why Choose Us" section.
const whyChooseUsVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE_OUT,
    },
  }),
};

export default AboutPage;