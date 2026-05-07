"use client";

import { motion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    delay?: number
}


// Function used to animate reveal of elements on the page (delay them by x seconds)
export const Reveal = ({ children, delay = 0 }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98]

            }}
            style={{ willChange: "opacity, transform" }}>
            {children}

        </motion.div>
    )
}