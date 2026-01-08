'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Youtube, 
  Facebook,
  MessageCircle
} from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    nome: '',
    email: '',
    telefone: '',
    servico: '',
    mensagem: ''
  });
  const [emailError, setEmailError] = useState('');

  // NUMERO DO WHATSAPP - ALTERE AQUI
  const whatsappNumber = "5511999999999";

  // Validacao de email com regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida email antes de enviar
    if (!isValidEmail(formState.email)) {
      setEmailError('Por favor, insira um email valido');
      return;
    }
    setEmailError('');
    
    // Monta a mensagem com os dados do formulario
    const servicoTexto = formState.servico ? `Servico: ${formState.servico}` : '';
    const telefoneTexto = formState.telefone ? `Telefone: ${formState.telefone}` : '';
    
    const mensagem = `Ola! Vim pelo site TIERRIFILMS.

*Dados do contato:*
Nome: ${formState.nome}
Email: ${formState.email}
${telefoneTexto}
${servicoTexto}

*Mensagem:*
${formState.mensagem}`.trim();

    // Abre o WhatsApp com a mensagem
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpa o formulario
    setFormState({ nome: '', email: '', telefone: '', servico: '', mensagem: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const socialLinks = [
    { icon: <Instagram className="w-4 h-4" />, label: "Instagram", href: "https://instagram.com/tierrifilms" },
    { icon: <Youtube className="w-4 h-4" />, label: "YouTube", href: "https://youtube.com/@tierrifilms" },
    { icon: <Facebook className="w-4 h-4" />, label: "Facebook", href: "https://facebook.com/tierrifilms" },
  ];

  return (
    <section id="contato" className="w-full py-24 px-4 relative overflow-hidden z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0a0a0a]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />

      <div className="max-w-3xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[#c9a227] text-sm tracking-[0.3em] uppercase mb-4 block">
            Contato
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Vamos <span className="text-[#c9a227]">Conversar?</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Conte-nos sobre seu projeto. Estamos prontos para transformar sua visao em realidade.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formState.nome}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#c9a227] focus:outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email *</label>
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
                  className={`w-full bg-[#141414] border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${
                    emailError ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a227]'
                  }`}
                  placeholder="seu@email.com"
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formState.telefone}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#c9a227] focus:outline-none transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Servico</label>
                <select
                  name="servico"
                  value={formState.servico}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Selecione um servico</option>
                  <option value="casamento">Filmagem de Casamento</option>
                  <option value="evento">Cobertura de Evento</option>
                  <option value="corporativo">Video Institucional</option>
                  <option value="clipe">Videoclipe Musical</option>
                  <option value="edicao">Edicao de Video</option>
                  <option value="drone">Filmagem com Drone</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Mensagem *</label>
              <textarea
                name="mensagem"
                value={formState.mensagem}
                onChange={handleChange}
                required
                rows={4}
                maxLength={500}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#c9a227] focus:outline-none transition-colors resize-none"
                placeholder="Conte-nos sobre seu projeto..."
              />
            </div>

            <button
              type="submit"
              className="group w-full bg-[#c9a227] hover:bg-[#e6b82e] text-black font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              Enviar
            </button>
          </form>
        </motion.div>

        {/* Informacoes de contato - linha horizontal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-[#1a1a1a]"
        >
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            <a href="tel:+5511999999999" className="flex items-center gap-2 hover:text-[#c9a227] transition-colors">
              <Phone className="w-4 h-4" />
              <span>(11) 99999-9999</span>
            </a>
            <span className="hidden sm:block text-[#2a2a2a]">|</span>
            <a href="mailto:contato@tierrifilms.com.br" className="flex items-center gap-2 hover:text-[#c9a227] transition-colors">
              <Mail className="w-4 h-4" />
              <span>contato@tierrifilms.com.br</span>
            </a>
            <span className="hidden sm:block text-[#2a2a2a]">|</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Sao Paulo, SP</span>
            </span>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#141414] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-gray-500 hover:text-[#c9a227] hover:border-[#c9a227]/50 transition-all"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
