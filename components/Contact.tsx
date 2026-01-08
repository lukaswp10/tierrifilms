'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    projeto: ''
  });
  const [emailError, setEmailError] = useState('');

  // NUMERO DO WHATSAPP - ALTERE AQUI
  const whatsappNumber = "5511999999999";

  // Validacao de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(formState.email)) {
      setEmailError('Por favor, insira um email valido');
      return;
    }
    setEmailError('');
    
    const empresaTexto = formState.empresa ? `Empresa: ${formState.empresa}` : '';
    const telefoneTexto = formState.telefone ? `Telefone: ${formState.telefone}` : '';
    
    const mensagem = `Ola! Vim pelo site TIERRIFILMS.

*Dados do contato:*
Nome: ${formState.nome}
Email: ${formState.email}
${telefoneTexto}
${empresaTexto}

*Sobre o projeto:*
${formState.projeto}`.trim();

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    
    setFormState({ nome: '', email: '', telefone: '', empresa: '', projeto: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contato" className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      {/* Titulo BORA FALAR! */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="title-large">
          <span className="text-white">BORA </span>
          <span className="text-white text-italic">FALAR!</span>
        </h2>
      </motion.div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            value={formState.nome}
            onChange={handleChange}
            required
            maxLength={100}
            className="input-minimal"
            placeholder="Seu nome"
          />
          
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={(e) => {
              handleChange(e);
              if (emailError) setEmailError('');
            }}
            required
            maxLength={100}
            className={`input-minimal ${emailError ? 'border-red-500' : ''}`}
            placeholder="Email"
          />
          {emailError && (
            <p className="text-red-500 text-xs">{emailError}</p>
          )}
          
          <input
            type="tel"
            name="telefone"
            value={formState.telefone}
            onChange={handleChange}
            maxLength={20}
            className="input-minimal"
            placeholder="DDD+Telefone"
          />
          
          <input
            type="text"
            name="empresa"
            value={formState.empresa}
            onChange={handleChange}
            maxLength={100}
            className="input-minimal"
            placeholder="Nome da sua empresa"
          />
          
          <textarea
            name="projeto"
            value={formState.projeto}
            onChange={handleChange}
            required
            rows={4}
            maxLength={500}
            className="input-minimal resize-none"
            placeholder="Fale sobre seu projeto"
          />
          
          <button type="submit" className="btn-solid w-full justify-center mt-8">
            <span>ENVIAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </section>
  );
}
