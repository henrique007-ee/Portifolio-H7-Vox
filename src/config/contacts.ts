/**
 * Configuração Oficial e Centralizada dos Contatos - H7.VOX
 * Profissional: Endson Henrique
 */

export const OFFICIAL_CONTACTS = {
  brandName: 'H7.VOX',
  ownerName: 'Endson Henrique',
  roleSubtitle: 'EDITOR DE VÍDEO • FILMMAKER • STORYMAKER',
  
  // WhatsApp oficial: 81985476681 -> https://wa.me/5581985476681
  whatsappRaw: '81985476681',
  whatsappDisplay: '(81) 98547-6681',
  whatsappCountryNumber: '5581985476681',
  whatsappBaseUrl: 'https://wa.me/5581985476681',

  // Instagram oficial: @h7.vox -> https://www.instagram.com/h7.vox/
  instagramHandle: 'h7.vox',
  instagramDisplay: '@h7.vox',
  instagramUrl: 'https://www.instagram.com/h7.vox/',

  // Email e Localização
  email: 'contato@h7vox.com.br',
  location: 'Pernambuco, Brasil',

  // Mensagens padronizadas e contextuais
  defaultMessage: 'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto audiovisual.',
  
  serviceMessage: (serviceTitle: string) => 
    `Olá, Endson! Gostaria de conversar sobre o serviço de ${serviceTitle} para o meu projeto.`,
    
  projectMessage: (projectTitle: string) => 
    `Olá, Endson! Assisti ao projeto "${projectTitle}" no seu portfólio H7.VOX e gostaria de conversar sobre uma produção audiovisual similar.`,

  aboutMessage: 'Olá, Endson! Conheci sua trajetória pelo site H7.VOX e gostaria de falar sobre uma oportunidade de projeto.',
} as const;

/**
 * Constrói link seguro e consistente para o WhatsApp oficial com mensagem contextualizada
 */
export function buildOfficialWhatsAppLink(message?: string): string {
  const cleanMessage = (message && message.trim()) ? message.trim() : OFFICIAL_CONTACTS.defaultMessage;
  return `${OFFICIAL_CONTACTS.whatsappBaseUrl}?text=${encodeURIComponent(cleanMessage)}`;
}

/**
 * Constrói link de WhatsApp com mensagem contextualizada para um serviço específico
 */
export function buildServiceWhatsAppLink(serviceTitle: string): string {
  return buildOfficialWhatsAppLink(OFFICIAL_CONTACTS.serviceMessage(serviceTitle));
}

/**
 * Constrói link de WhatsApp com mensagem contextualizada para um projeto específico
 */
export function buildProjectWhatsAppLink(projectTitle: string): string {
  return buildOfficialWhatsAppLink(OFFICIAL_CONTACTS.projectMessage(projectTitle));
}
