import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { MdBrush } from 'react-icons/md'; // Example icon for "Customize It" button

import state from '../store';
import { CustomButton } from '../components';
import { animationVariants } from '../config/motion'; // Using the unified animationVariants

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...animationVariants.slide('left')}>
          <motion.header {...animationVariants.slide("down")}>
            <img
              src='./threejs.png' // Assuming this is your main logo
              alt="logo"
              className="w-10 h-10 object-contain" // Slightly larger logo
            />
            {/* New: Optional app title next to logo */}
            <h1 className="text-xl font-bold ml-2 text-gray-800">3D Customizer</h1>
          </motion.header>

          <motion.div className="home-content" {...animationVariants.headContainer}>
            <motion.div {...animationVariants.headText}>
              <h1 className="head-text">
                LET'S <br className="xl:block hidden" /> DO IT.
              </h1>
            </motion.div>
            <motion.div
              {...animationVariants.headContent}
              className="flex flex-col gap-5"
            >
              <p className="max-w-md font-normal text-gray-600 text-base leading-relaxed"> {/* Enhanced line-height */}
                Create your unique and exclusive shirt with our brand-new 3D customization tool.
                <strong> Unleash your imagination</strong>{" "} and define your own style.
                Perfect for personal flair, team wear, or unique gifts.
              </p>

              <CustomButton
                type="filled"
                title="Customize It"
                handleClick={() => state.intro = false}
                customStyles="w-fit px-5 py-3 font-bold text-base shadow-lg hover:shadow-xl" // Enhanced styling
                IconComponent={MdBrush} // Example icon
              />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Home;