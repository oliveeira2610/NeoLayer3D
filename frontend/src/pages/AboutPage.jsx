import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      {/* Page Title */}
      <section className="page-title">
        <div className="container">
          <h1>Sobre a NeoLayer3D</h1>
          <div className="breadcrumb">
            <a href="/">Início</a> / <span>Sobre Nós</span>
          </div>
        </div>
      </section>

      {/* About Hero Section */}
      <section className="section about-hero">
        <div className="container">
          <div className="about-hero-content">
            <div className="about-hero-text fade-in">
              <h2>Transformando ideias em realidade tridimensional</h2>
              <p>A NeoLayer3D nasceu da paixão por tecnologia e inovação, com o objetivo de democratizar o acesso à impressão 3D de alta qualidade no Brasil. Fundada em 2020 por um grupo de engenheiros e designers, nossa empresa rapidamente se estabeleceu como referência no mercado de manufatura aditiva.</p>
              <p>Combinamos tecnologia de ponta, materiais premium e expertise técnica para oferecer soluções personalizadas que atendem às necessidades específicas de cada cliente, seja para protótipos funcionais, peças de reposição, objetos decorativos ou projetos educacionais.</p>
            </div>
            <div className="about-hero-image fade-in">
              <img src="/images/sobre-hero.jpg" alt="Equipe NeoLayer3D" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section our-story">
        <div className="container">
          <h2 className="section-title">Nossa História</h2>
          <div className="timeline">
            <div className="timeline-item fade-in">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2020</div>
              <div className="timeline-content">
                <h3>O Início</h3>
                <p>A NeoLayer3D foi fundada por três amigos apaixonados por tecnologia: Carlos Mendes (Engenheiro Mecânico), Mariana Silva (Designer Industrial) e Rafael Torres (Especialista em Materiais). Com apenas duas impressoras 3D em um pequeno escritório, começamos a atender projetos de pequena escala.</p>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2021</div>
              <div className="timeline-content">
                <h3>Expansão</h3>
                <p>Com o crescimento da demanda, expandimos nossa operação para um galpão de 200m² e adquirimos equipamentos de última geração. Nossa equipe cresceu para 10 colaboradores e começamos a atender clientes corporativos em todo o Brasil.</p>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2022</div>
              <div className="timeline-content">
                <h3>Inovação</h3>
                <p>Desenvolvemos nossa própria linha de filamentos especiais e resinas, garantindo maior controle de qualidade e possibilitando aplicações mais específicas. Iniciamos parcerias com universidades para projetos de pesquisa e desenvolvimento.</p>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2023</div>
              <div className="timeline-content">
                <h3>Reconhecimento</h3>
                <p>Fomos premiados como "Empresa Inovadora do Ano" pela Associação Brasileira de Tecnologia Industrial. Expandimos nossa atuação para toda América Latina e iniciamos o desenvolvimento de nossa plataforma de e-commerce.</p>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>Consolidação</h3>
                <p>Inauguramos nossa nova sede com 1.000m² incluindo fábrica, showroom e centro de treinamento. Lançamos nossa loja online para atender clientes em todo o Brasil com produtos padronizados e personalizados.</p>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2025</div>
              <div className="timeline-content">
                <h3>Presente e Futuro</h3>
                <p>Hoje, contamos com uma equipe de 35 profissionais especializados e um parque de mais de 50 impressoras 3D de diferentes tecnologias. Estamos investindo em sustentabilidade com o desenvolvimento de materiais biodegradáveis e processos de reciclagem de filamentos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values Section */}
      <section className="section mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-box fade-in">
              <div className="mission-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Missão</h3>
              <p>Democratizar o acesso à tecnologia de impressão 3D, transformando ideias em objetos reais com qualidade, precisão e agilidade, contribuindo para a inovação e o desenvolvimento de projetos criativos e funcionais.</p>
            </div>
            <div className="mission-box fade-in">
              <div className="mission-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Visão</h3>
              <p>Ser reconhecida como a empresa líder em soluções de impressão 3D na América Latina até 2030, referência em inovação, qualidade e sustentabilidade, impactando positivamente diversos setores da economia.</p>
            </div>
            <div className="mission-box fade-in">
              <div className="mission-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Valores</h3>
              <ul>
                <li>Inovação constante</li>
                <li>Excelência técnica</li>
                <li>Sustentabilidade</li>
                <li>Foco no cliente</li>
                <li>Ética e transparência</li>
                <li>Colaboração e trabalho em equipe</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section team-section">
        <div className="container">
          <h2 className="section-title">Nossa Equipe</h2>
          <div className="team-grid">
            <div className="team-member fade-in">
              <div className="team-photo">
                <img src="/images/team-1.jpg" alt="Carlos Mendes - CEO e Fundador" />
              </div>
              <div className="team-info">
                <h3>Carlos Mendes</h3>
                <p className="team-role">CEO e Fundador</p>
                <p className="team-bio">Engenheiro Mecânico com mais de 15 anos de experiência em manufatura avançada. Especialista em tecnologias de impressão 3D e processos industriais.</p>
                <div className="team-social">
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
            <div className="team-member fade-in">
              <div className="team-photo">
                <img src="/images/team-2.jpg" alt="Mariana Silva - Diretora de Design" />
              </div>
              <div className="team-info">
                <h3>Mariana Silva</h3>
                <p className="team-role">Diretora de Design</p>
                <p className="team-bio">Designer Industrial com formação pela ESDI e mestrado em Design de Produto. Especialista em modelagem 3D e otimização de designs para manufatura aditiva.</p>
                <div className="team-social">
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
            <div className="team-member fade-in">
              <div className="team-photo">
                <img src="/images/team-3.jpg" alt="Rafael Torres - Diretor Técnico" />
              </div>
              <div className="team-info">
                <h3>Rafael Torres</h3>
                <p className="team-role">Diretor Técnico</p>
                <p className="team-bio">Engenheiro de Materiais com doutorado em Polímeros. Responsável pelo desenvolvimento de novos materiais e controle de qualidade dos processos de impressão.</p>
                <div className="team-social">
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-github"></i></a>
                </div>
              </div>
            </div>
            <div className="team-member fade-in">
              <div className="team-photo">
                <img src="/images/team-4.jpg" alt="Juliana Costa - Gerente de Operações" />
              </div>
              <div className="team-info">
                <h3>Juliana Costa</h3>
                <p className="team-role">Gerente de Operações</p>
                <p className="team-bio">Engenheira de Produção com especialização em Lean Manufacturing. Responsável pela otimização dos processos produtivos e logística da empresa.</p>
                <div className="team-social">
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section technology-section">
        <div className="container">
          <h2 className="section-title">Nossas Tecnologias</h2>
          <div className="technology-grid">
            <div className="technology-item fade-in">
              <div className="technology-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <h3>FDM (Modelagem por Deposição de Material Fundido)</h3>
              <p>Tecnologia versátil que utiliza filamentos termoplásticos para criar objetos camada por camada. Ideal para protótipos funcionais, peças mecânicas e objetos de uso cotidiano.</p>
              <ul className="technology-features">
                <li>Materiais: PLA, ABS, PETG, TPU, Nylon</li>
                <li>Precisão: até 0.1mm</li>
                <li>Tamanho máximo: 300 x 300 x 400mm</li>
              </ul>
            </div>
            <div className="technology-item fade-in">
              <div className="technology-icon">
                <i className="fas fa-tint"></i>
              </div>
              <h3>SLA (Estereolitografia)</h3>
              <p>Tecnologia de alta precisão que utiliza resina líquida fotossensível curada por luz UV. Perfeita para modelos detalhados, protótipos estéticos e peças com acabamento superior.</p>
              <ul className="technology-features">
                <li>Materiais: Resinas standard, transparentes, flexíveis e biocompatíveis</li>
                <li>Precisão: até 0.025mm</li>
                <li>Tamanho máximo: 200 x 200 x 250mm</li>
              </ul>
            </div>
            <div className="technology-item fade-in">
              <div className="technology-icon">
                <i className="fas fa-atom"></i>
              </div>
              <h3>SLS (Sinterização Seletiva a Laser)</h3>
              <p>Tecnologia que utiliza laser para sinterizar pó de nylon ou outros materiais. Ideal para peças funcionais complexas com alta resistência mecânica.</p>
              <ul className="technology-features">
                <li>Materiais: Nylon PA12, PA11, TPU em pó</li>
                <li>Precisão: até 0.1mm</li>
                <li>Tamanho máximo: 250 x 250 x 300mm</li>
              </ul>
            </div>
            <div className="technology-item fade-in">
              <div className="technology-icon">
                <i className="fas fa-cubes"></i>
              </div>
              <h3>Impressão Multi-Material</h3>
              <p>Tecnologia avançada que permite a impressão com múltiplos materiais e cores em um único objeto. Perfeita para protótipos realistas e peças com propriedades variadas.</p>
              <ul className="technology-features">
                <li>Materiais: Combinações de PLA, ABS, PVA, TPU</li>
                <li>Precisão: até 0.1mm</li>
                <li>Tamanho máximo: 250 x 250 x 200mm</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="section clients-section">
        <div className="container">
          <h2 className="section-title">Nossos Clientes</h2>
          <p className="section-subtitle">Empresas que confiam em nossas soluções de impressão 3D</p>
          <div className="clients-grid">
            <div className="client-logo fade-in">
              <img src="/images/client-1.png" alt="Cliente 1" />
            </div>
            <div className="client-logo fade-in">
              <img src="/images/client-2.png" alt="Cliente 2" />
            </div>
            <div className="client-logo fade-in">
              <img src="/images/client-3.png" alt="Cliente 3" />
            </div>
            <div className="client-logo fade-in">
              <img src="/images/client-4.png" alt="Cliente 4" />
            </div>
            <div className="client-logo fade-in">
              <img src="/images/client-5.png" alt="Cliente 5" />
            </div>
            <div className="client-logo fade-in">
              <img src="/images/client-6.png" alt="Cliente 6" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;

