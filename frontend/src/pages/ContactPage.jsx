import React, { useState } from 'react';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    submitting: false,
    error: null,
    success: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ ...formStatus, submitting: true });
    
    // Simulação de envio do formulário
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        submitting: false,
        error: null,
        success: true
      });
      
      // Limpar o formulário após envio bem-sucedido
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Resetar o status após 5 segundos
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          submitting: false,
          error: null,
          success: false
        });
      }, 5000);
    }, 1500);
  };

  const toggleFaqItem = (e) => {
    const faqItem = e.currentTarget.parentNode;
    faqItem.classList.toggle('active');
  };

  return (
    <div className="contact-page">
      {/* Page Title */}
      <section className="page-title">
        <div className="container">
          <h1>Entre em Contato</h1>
          <div className="breadcrumb">
            <a href="/">Início</a> / <span>Contato</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-form-container">
            <div className="contact-info">
              <h3>Informações de Contato</h3>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4>Endereço</h4>
                  <p>Av. Tecnologia, 1000<br />Bairro Inovação<br />São Paulo - SP, 01234-567</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4>Telefone</h4>
                  <p>(11) 3456-7890</p>
                  <p>(11) 98765-4321</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4>E-mail</h4>
                  <p>contato@neolayer3d.com.br</p>
                  <p>suporte@neolayer3d.com.br</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h4>Horário de Atendimento</h4>
                  <p>Segunda a Sexta: 9h às 18h</p>
                  <p>Sábado: 9h às 13h</p>
                </div>
              </div>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="contact-form">
              <h3>Envie sua Mensagem</h3>
              {formStatus.success && (
                <div className="form-success-message">
                  <i className="fas fa-check-circle"></i>
                  <p>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
                </div>
              )}
              {formStatus.error && (
                <div className="form-error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>{formStatus.error}</p>
                </div>
              )}
              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nome Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Telefone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Assunto</label>
                  <select 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control" 
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="orcamento">Orçamento</option>
                    <option value="duvida">Dúvida sobre produto</option>
                    <option value="suporte">Suporte técnico</option>
                    <option value="parceria">Proposta de parceria</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Mensagem</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control" 
                    rows="5" 
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={formStatus.submitting}
                  >
                    {formStatus.submitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section map-section">
        <div className="container">
          <h2 className="section-title">Nossa Localização</h2>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975216518994!2d-46.65429492549805!3d-23.564611060709143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1685723456789!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">Perguntas Frequentes</h2>
          <div className="faq-container">
            <div className="faq-item">
              <div className="faq-question" onClick={toggleFaqItem}>
                <h3>Qual é o prazo de entrega dos produtos?</h3>
                <span className="faq-icon"><i className="fas fa-chevron-down"></i></span>
              </div>
              <div className="faq-answer">
                <p>O prazo de entrega varia de acordo com a localização e o método de envio escolhido. Em geral, nossos produtos são enviados em 1-3 dias úteis após a confirmação do pagamento. O prazo de entrega pode variar de 2 a 10 dias úteis, dependendo da região e do serviço de entrega selecionado.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={toggleFaqItem}>
                <h3>É possível personalizar os produtos?</h3>
                <span className="faq-icon"><i className="fas fa-chevron-down"></i></span>
              </div>
              <div className="faq-answer">
                <p>Sim, oferecemos serviços de personalização para a maioria dos nossos produtos. Você pode escolher cores, materiais e, em alguns casos, dimensões específicas. Para projetos totalmente personalizados, recomendamos entrar em contato diretamente conosco para discutir suas necessidades e obter um orçamento.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={toggleFaqItem}>
                <h3>Quais materiais são utilizados na impressão 3D?</h3>
                <span className="faq-icon"><i className="fas fa-chevron-down"></i></span>
              </div>
              <div className="faq-answer">
                <p>Trabalhamos com diversos materiais de alta qualidade, incluindo PLA, ABS, PETG, TPU flexível e resinas. Cada material possui características específicas de resistência, flexibilidade, acabamento e temperatura de operação. Na página de cada produto, você encontrará informações sobre o material utilizado e opções disponíveis para personalização.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={toggleFaqItem}>
                <h3>Como funciona a garantia dos produtos?</h3>
                <span className="faq-icon"><i className="fas fa-chevron-down"></i></span>
              </div>
              <div className="faq-answer">
                <p>Todos os nossos produtos possuem garantia de 30 dias contra defeitos de fabricação. Caso identifique algum problema com seu produto, entre em contato com nosso suporte técnico para orientações sobre o processo de troca ou devolução. Lembre-se que a garantia não cobre danos causados por uso inadequado ou desgaste natural.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={toggleFaqItem}>
                <h3>Vocês aceitam projetos personalizados?</h3>
                <span className="faq-icon"><i className="fas fa-chevron-down"></i></span>
              </div>
              <div className="faq-answer">
                <p>Sim, aceitamos projetos personalizados! Se você tem uma ideia ou necessidade específica, entre em contato conosco com os detalhes do seu projeto. Nossa equipe técnica analisará a viabilidade e fornecerá um orçamento personalizado. Também oferecemos serviços de modelagem 3D caso você não possua o arquivo digital do seu projeto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <h2 className="newsletter-title">Receba Novidades e Ofertas Exclusivas</h2>
          <p>Inscreva-se em nossa newsletter e fique por dentro das últimas tendências em impressão 3D.</p>
          <form className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Seu melhor e-mail" required />
            <button type="submit" className="newsletter-btn">Inscrever-se</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;

