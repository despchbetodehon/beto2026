import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    minHeight: '100vh',
    padding: '80px 16px 64px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(120deg,#f4f6f9 60%,#e9ecef 100%)',
    flexDirection: 'column',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Montserrat, Poppins, sans-serif',
    fontWeight: 900,
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    color: '#2d5a3d',
    marginBottom: '16px',
    textShadow: '0 2px 12px rgba(45,90,61,0.4)',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#555',
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    fontWeight: 600,
    maxWidth: 720,
    marginBottom: '32px',
    textShadow: '0 0 6px rgba(0,0,0,0.07)',
  },
  heroImg: {
    width: 'min(420px, 90vw)',
    height: 'auto',
    borderRadius: 32,
    boxShadow: '0 0 40px rgba(33,243,172,0.2), 0 0 14px #ffd70033',
    border: '2px solid #ddd',
    background: '#fff',
    marginBottom: '32px',
  },
  ctaBtn: {
    fontWeight: 800,
    fontSize: 18,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #5d6d7e 75%, #85929e 100%)',
    color: '#ffffff',
    padding: '12.8px 40px',
    boxShadow: '0 8px 32px rgba(44, 62, 80, 0.25)',
    letterSpacing: 1.3,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #34495e 0%, #5d6d7e 25%, #85929e 75%, #aab7b8 100%)',
      color: '#ffffff',
      boxShadow: '0 12px 40px rgba(44, 62, 80, 0.35)',
      transform: 'translateY(-2px)',
    },
  },
}));

export default function Land() {
  const classes = useStyles();

  const fadeAnim = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0 },
  };

  return (

   
    <motion.section
      className={classes.root}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeAnim}
      transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
      id="home"
    >
      
      <motion.img
        src="/betologo.jpg"
        alt="Beto Dehon Hero"
        className={classes.heroImg}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.07, 1], opacity: [0, 1] }}
        transition={{ duration: 1.1, delay: 0.22 }}
      />
      <Typography className={classes.title} component="h1">
        Despachante Beto Dehon
      </Typography>
      <Typography className={classes.subtitle}>
        Atendimento ágil, confiável e 100% digital.<br />
        Somos especialistas em documentação veicular no Brasil e no exterior.
      </Typography>
      <Button
        className={classes.ctaBtn}
        href="https://wa.me/5548999990000"
        target="_blank"
        rel="noopener"
        startIcon={<FaWhatsapp />}
        aria-label="Chamar no WhatsApp"
      >
        Fale Conosco no WhatsApp
      </Button>
    </motion.section>
  );
}
