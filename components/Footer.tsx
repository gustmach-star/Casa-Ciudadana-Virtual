import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <p className="mb-2">&copy; 2026 La Casa Común. Todos los derechos reservados.</p>
          <p>
            <button 
              onClick={() => setShowPrivacyModal(true)} 
              className="hover:text-white underline cursor-pointer"
            >
              Política de Privacidad
            </button>
            {' | '}
            <button 
              onClick={() => setShowTermsModal(true)} 
              className="hover:text-white underline cursor-pointer"
            >
              Términos de Uso
            </button>
          </p>
        </div>
      </footer>

      {/* Modal de Política de Privacidad */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPrivacyModal(false)}>
          <div className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Política de Privacidad</h2>
              <button onClick={() => setShowPrivacyModal(false)} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
              <h3 className="text-xl font-bold">Aplicación "Casa Común"</h3>
              <p className="text-gray-500">Última actualización: 17 de Dic/2025</p>

              <div>
                <h4 className="font-bold text-base mb-2">1. Responsable del Tratamiento</h4>
                <p>El responsable del tratamiento de los datos es la plataforma Casa Común, en coordinación con los Partidos Políticos usuarios, conforme a la Ley N.° 8968 – Protección de la Persona frente al Tratamiento de sus Datos Personales.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">2. Datos que se Recopilan</h4>
                <p>Dependiendo del uso de la plataforma, se pueden recopilar:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Datos de identificación básica (nombre, correo electrónico, cantón).</li>
                  <li>Datos de contacto.</li>
                  <li>Información relacionada con solicitudes de signos externos, transporte o información electoral.</li>
                  <li>Datos técnicos (IP, navegador, dispositivo) para seguridad y auditoría.</li>
                </ul>
                <p className="mt-2">❌ No se recopilan datos sensibles como religión, salud, orientación sexual u opiniones privadas no vinculadas voluntariamente a la actividad política.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">3. Finalidad del Tratamiento</h4>
                <p>Los datos se utilizan exclusivamente para:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Gestionar servicios de la Casa de Campaña Virtual.</li>
                  <li>Automatizar solicitudes y procesos logísticos.</li>
                  <li>Generar métricas agregadas de eficiencia.</li>
                  <li>Mejorar la experiencia de usuario.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">4. Base Legal</h4>
                <p>El tratamiento se basa en:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>El consentimiento informado del usuario.</li>
                  <li>El interés legítimo de los partidos para su organización interna.</li>
                  <li>El cumplimiento de obligaciones legales electorales.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">5. Almacenamiento y Seguridad</h4>
                <p>Casa Común aplica medidas de ciberseguridad razonables y proporcionales, incluyendo:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Cifrado de datos en tránsito (HTTPS).</li>
                  <li>Control de accesos por roles.</li>
                  <li>Registros de actividad (logs).</li>
                  <li>Buenas prácticas de respaldo y continuidad.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">6. Compartición de Datos</h4>
                <p>Los datos:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>No se venden ni comercializan.</li>
                  <li>Solo se comparten con el partido correspondiente o proveedores tecnológicos estrictamente necesarios.</li>
                  <li>No se transfieren internacionalmente salvo que el proveedor cumpla estándares adecuados de protección.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">7. Derechos de las Personas Usuarias</h4>
                <p>Las personas usuarias pueden ejercer sus derechos de:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Acceso</li>
                  <li>Rectificación</li>
                  <li>Cancelación</li>
                  <li>Oposición</li>
                </ul>
                <p className="mt-2">mediante solicitud al correo: [correo de contacto].</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">8. Conservación de Datos</h4>
                <p>Los datos se conservarán únicamente por el tiempo necesario para cumplir su finalidad o mientras exista relación activa con la plataforma.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">9. Uso de Cookies</h4>
                <p>Casa Común puede utilizar cookies técnicas y analíticas no invasivas, exclusivamente para funcionamiento y mejora del servicio.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">10. Cambios en la Política</h4>
                <p>Esta Política podrá actualizarse. Los cambios relevantes serán comunicados oportunamente a los usuarios.</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Términos de Uso */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowTermsModal(false)}>
          <div className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Términos de Uso</h2>
              <button onClick={() => setShowTermsModal(false)} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
              <h3 className="text-xl font-bold">Aplicación "Casa Común"</h3>
              <p className="text-gray-500">Última actualización: 17 de Dic/2025</p>

              <div>
                <h4 className="font-bold text-base mb-2">1. Aceptación de los Términos</h4>
                <p>El acceso y uso de la plataforma digital Casa Común implica la aceptación plena y sin reservas de los presentes Términos de Uso. Si la persona usuaria no está de acuerdo con estos términos, deberá abstenerse de utilizar la aplicación.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">2. Descripción del Servicio</h4>
                <p>Casa Común es una plataforma digital diseñada para funcionar como una Casa de Campaña Virtual, orientada a Partidos Políticos debidamente inscritos ante el Tribunal Supremo de Elecciones de Costa Rica, con el objetivo de:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Reducir costos operativos y logísticos.</li>
                  <li>Automatizar servicios tradicionales de locales físicos.</li>
                  <li>Facilitar la interacción digital con militantes, simpatizantes y ciudadanía.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">3. Usuarios Autorizados</h4>
                <p>Pueden utilizar la plataforma:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Representantes oficiales de partidos políticos.</li>
                  <li>Personas colaboradoras autorizadas por dichos partidos.</li>
                  <li>Ciudadanía que interactúe voluntariamente con los servicios ofrecidos.</li>
                </ul>
                <p className="mt-2">Cada partido es responsable del uso que hagan sus usuarios internos de la plataforma.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">4. Uso Permitido</h4>
                <p>La persona usuaria se compromete a:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Utilizar la plataforma exclusivamente para fines legales, políticos y organizativos lícitos.</li>
                  <li>No emplear la aplicación para actividades fraudulentas, difamatorias, violentas o contrarias al ordenamiento jurídico costarricense.</li>
                  <li>Respetar la normativa electoral vigente.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">5. Prohibiciones</h4>
                <p>Queda estrictamente prohibido:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Intentar acceder sin autorización a sistemas, bases de datos o información.</li>
                  <li>Introducir malware, bots, scripts o cualquier mecanismo que afecte la seguridad.</li>
                  <li>Usar la plataforma para campañas de odio, acoso o desinformación.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">6. Propiedad Intelectual</h4>
                <p>Todos los contenidos, software, diseños, flujos y funcionalidades de Casa Común son propiedad de sus desarrolladores o licenciatarios. El uso del servicio no otorga derechos de propiedad intelectual.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">7. Disponibilidad del Servicio</h4>
                <p>La plataforma se ofrece bajo modalidad "tal cual", pudiendo realizarse mejoras, mantenimientos o suspensiones temporales sin previo aviso.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">8. Limitación de Responsabilidad</h4>
                <p>Casa Común no será responsable por:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Decisiones políticas tomadas por los partidos.</li>
                  <li>Contenidos publicados por usuarios.</li>
                  <li>Fallos derivados de servicios de terceros (hosting, pasarelas, mensajería).</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">9. Suspensión o Terminación</h4>
                <p>Se podrá suspender o cancelar el acceso ante incumplimiento de estos términos o uso indebido de la plataforma.</p>
              </div>

              <div>
                <h4 className="font-bold text-base mb-2">10. Legislación Aplicable</h4>
                <p>Estos Términos se rigen por las leyes de la República de Costa Rica. Cualquier controversia será sometida a los tribunales competentes del país.</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;