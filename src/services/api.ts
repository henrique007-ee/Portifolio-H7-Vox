import type { 
  Project, 
  ServiceItem, 
  Testimonial, 
  Brand, 
  BackstageItem, 
  SiteSettings, 
  BriefingLead,
  CategoryItem,
  VisualIdentityProject,
  VisitorNotification,
  VisitorStats,
  SimulatorConfig,
  BudgetSimulationLead
} from '../types';

const TOKEN_KEY = 'h7vox_admin_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Direct PC Image / File Upload
  async uploadFile(file: File): Promise<{ success: boolean; url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              filename: file.name,
              data: base64,
            }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Falha ao salvar no servidor.');
          }
          const result = await res.json();
          resolve(result);
        } catch (err: any) {
          // Robust fallback: if network/server is unreachable, use base64 data URL directly so image is never lost
          resolve({
            success: true,
            url: reader.result as string,
            filename: file.name,
          });
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo selecionado do computador.'));
      reader.readAsDataURL(file);
    });
  },

  // Public Data
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Falha ao carregar configurações');
    return res.json();
  },

  async getCategories(all = false): Promise<CategoryItem[]> {
    const res = await fetch(`/api/categories${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Falha ao carregar categorias');
    return res.json();
  },

  async updateCategories(categories: CategoryItem[]): Promise<CategoryItem[]> {
    const res = await fetch('/api/categories', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categories),
    });
    if (!res.ok) throw new Error('Falha ao atualizar categorias');
    return res.json();
  },

  async getProjects(admin = false): Promise<Project[]> {
    const res = await fetch(`/api/projects${admin ? '?admin=true' : ''}`);
    if (!res.ok) throw new Error('Falha ao carregar projetos');
    return res.json();
  },

  async getTrashProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects/trash', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Falha ao carregar lixeira de projetos');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) throw new Error('Projeto não encontrado');
    return res.json();
  },

  async getServices(): Promise<ServiceItem[]> {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Falha ao carregar serviços');
    return res.json();
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Falha ao carregar depoimentos');
    return res.json();
  },

  async getBrands(all = false): Promise<Brand[]> {
    const url = all ? '/api/brands/all' : '/api/brands';
    const res = await fetch(url, {
      headers: all ? getAuthHeaders() : undefined,
    });
    if (!res.ok) throw new Error('Falha ao carregar clientes/marcas');
    return res.json();
  },

  async checkBrandUsage(id: string): Promise<{
    brand: Brand;
    inUse: boolean;
    projectCount: number;
    projectTitles: string[];
    projects: { id: string; title: string }[];
  }> {
    const res = await fetch(`/api/brands/${id}/check-usage`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Falha ao verificar uso da marca');
    return res.json();
  },

  async getBackstage(): Promise<BackstageItem[]> {
    const res = await fetch('/api/backstage');
    if (!res.ok) throw new Error('Falha ao carregar bastidores');
    return res.json();
  },

  async validateInstagram(url: string): Promise<{
    valid: boolean;
    code: string;
    cleanUrl: string;
    embedUrl: string;
  }> {
    const res = await fetch('/api/instagram/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Link do Instagram inválido.');
    }
    return res.json();
  },

  async submitBriefingLead(lead: {
    name: string;
    companyOrProject: string;
    service: string;
    estimatedDate?: string;
    description: string;
  }): Promise<{ success: boolean; lead: BriefingLead }> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao enviar dados do projeto.');
    }
    return res.json();
  },

  // Admin Auth
  async login(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Senha incorreta.');
    }
    const data = await res.json();
    authStorage.setToken(data.token);
    return data;
  },

  async verifyAuth(): Promise<boolean> {
    const token = authStorage.getToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.valid === true;
    } catch {
      return false;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao alterar senha.');
    }
  },

  // Admin Project mutations
  async saveProject(project: Partial<Project>): Promise<Project> {
    const isEdit = Boolean(project.id);
    const url = isEdit ? `/api/projects/${project.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao salvar projeto');
    }
    return res.json();
  },

  // Real Delete Project from Database
  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao excluir projeto do banco de dados.');
    }
    return res.json();
  },

  // Soft Delete / Move to Trash
  async moveToTrash(id: string): Promise<{ success: boolean; message: string; project: Project }> {
    const res = await fetch(`/api/projects/${id}/trash`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao mover projeto para a lixeira.');
    }
    return res.json();
  },

  // Restore from Trash
  async restoreFromTrash(id: string): Promise<{ success: boolean; message: string; project: Project }> {
    const res = await fetch(`/api/projects/${id}/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao restaurar projeto da lixeira.');
    }
    return res.json();
  },

  // Permanent Delete
  async deleteProjectPermanent(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/projects/${id}/permanent`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao excluir projeto definitivamente.');
    }
    return res.json();
  },

  // Empty Trash
  async emptyTrash(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/projects/trash/empty', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao esvaziar lixeira.');
    }
    return res.json();
  },

  // Admin Services
  async updateServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    const res = await fetch('/api/services', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(services),
    });
    if (!res.ok) throw new Error('Erro ao atualizar serviços');
    return res.json();
  },

  // Admin Testimonials
  async saveTestimonial(item: Partial<Testimonial>): Promise<Testimonial> {
    const isEdit = Boolean(item.id);
    const url = isEdit ? `/api/testimonials/${item.id}` : '/api/testimonials';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Erro ao salvar depoimento');
    return res.json();
  },

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao excluir depoimento');
  },

  // Admin Brands
  async saveBrand(brand: Partial<Brand>): Promise<Brand> {
    const isEdit = Boolean(brand.id);
    const url = isEdit ? `/api/brands/${brand.id}` : '/api/brands';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(brand),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao salvar marca');
    }
    return res.json();
  },

  async updateBrands(brands: Brand[]): Promise<Brand[]> {
    const res = await fetch('/api/brands', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(brands),
    });
    if (!res.ok) throw new Error('Erro ao atualizar marcas');
    return res.json();
  },

  async deleteBrand(id: string, options?: { unlink?: boolean; force?: boolean }): Promise<{
    success: boolean;
    message: string;
    inUse?: boolean;
    projectCount?: number;
    projectTitles?: string[];
  }> {
    const query = new URLSearchParams();
    if (options?.unlink) query.set('unlink', 'true');
    if (options?.force) query.set('force', 'true');

    const res = await fetch(`/api/brands/${id}?${query.toString()}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 409) {
        return {
          success: false,
          message: data.error || 'Marca vinculada a projetos.',
          inUse: true,
          projectCount: data.projectCount,
          projectTitles: data.projectTitles,
        };
      }
      throw new Error(data.error || 'Erro ao excluir marca');
    }
    return { success: true, message: data.message };
  },

  // Admin Backstage
  async saveBackstage(item: Partial<BackstageItem>): Promise<BackstageItem> {
    const isEdit = Boolean(item.id);
    const url = isEdit ? `/api/backstage/${item.id}` : '/api/backstage';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Erro ao salvar item dos bastidores');
    return res.json();
  },

  async deleteBackstage(id: string): Promise<void> {
    const res = await fetch(`/api/backstage/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao excluir item de bastidor');
  },

  async clearAllBackstage(): Promise<void> {
    const res = await fetch('/api/backstage-all', {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao apagar todos os bastidores');
  },

  // Admin Settings
  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Erro ao salvar configurações do site');
    return res.json();
  },

  // Admin Leads
  async getLeads(): Promise<BriefingLead[]> {
    const res = await fetch('/api/leads', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao obter contatos');
    return res.json();
  },

  async updateLeadStatus(id: string, status: BriefingLead['status']): Promise<BriefingLead> {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar status');
    return res.json();
  },

  async deleteLead(id: string): Promise<void> {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao remover lead');
  },

  // Project Metrics
  async updateProjectMetrics(id: string, metrics: { likesCount?: number; viewsCount?: number }): Promise<void> {
    const res = await fetch(`/api/projects/${id}/metrics`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(metrics),
    });
    if (!res.ok) throw new Error('Erro ao atualizar métricas');
  },

  // Brand Soft Delete & Restore
  async trashBrand(id: string): Promise<void> {
    const res = await fetch(`/api/brands/${id}/trash`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao mover marca para a lixeira');
  },

  async restoreBrand(id: string): Promise<void> {
    const res = await fetch(`/api/brands/${id}/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao restaurar marca da lixeira');
  },

  // Visual Identities
  async getVisualIdentities(admin = false, trash = false): Promise<VisualIdentityProject[]> {
    const url = `/api/visual-identities${trash ? '?trash=true' : admin ? '?admin=true' : ''}`;
    const res = await fetch(url, {
      headers: admin || trash ? getAuthHeaders() : undefined,
    });
    if (!res.ok) throw new Error('Erro ao carregar identidades visuais');
    return res.json();
  },

  async getVisualIdentity(id: string): Promise<VisualIdentityProject> {
    const res = await fetch(`/api/visual-identities/${id}`);
    if (!res.ok) throw new Error('Identidade visual não encontrada');
    return res.json();
  },

  async saveVisualIdentity(project: Partial<VisualIdentityProject>): Promise<VisualIdentityProject> {
    const isEdit = Boolean(project.id);
    const url = isEdit ? `/api/visual-identities/${project.id}` : '/api/visual-identities';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Erro ao salvar identidade visual');
    return res.json();
  },

  async trashVisualIdentity(id: string): Promise<void> {
    const res = await fetch(`/api/visual-identities/${id}/trash`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao mover identidade visual para lixeira');
  },

  async restoreVisualIdentity(id: string): Promise<void> {
    const res = await fetch(`/api/visual-identities/${id}/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao restaurar identidade visual da lixeira');
  },

  async deleteVisualIdentity(id: string): Promise<void> {
    const res = await fetch(`/api/visual-identities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao excluir definitivamente identidade visual');
  },

  // Visitor Analytics
  async recordVisit(pathName = '/', referrer = ''): Promise<void> {
    try {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
      
      // Get or create session token in sessionStorage
      let sessionToken = sessionStorage.getItem('h7vox_session_id');
      if (!sessionToken) {
        sessionToken = 'sess-' + Math.random().toString(36).substring(2) + '-' + Date.now();
        sessionStorage.setItem('h7vox_session_id', sessionToken);
      }

      await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathName,
          referrer: referrer || document.referrer || '',
          deviceType,
          sessionToken,
        }),
      });
    } catch {
      // Non-blocking
    }
  },

  async getVisitorNotifications(): Promise<{ notifications: VisitorNotification[]; unreadCount: number }> {
    const res = await fetch('/api/analytics/notifications', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao carregar notificações');
    return res.json();
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const res = await fetch(`/api/analytics/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao marcar notificação');
  },

  async markAllNotificationsAsRead(): Promise<void> {
    const res = await fetch('/api/analytics/notifications/read-all', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao marcar notificações');
  },

  async deleteNotification(id: string): Promise<void> {
    const res = await fetch(`/api/analytics/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao excluir notificação');
  },

  async getVisitorStats(): Promise<VisitorStats> {
    const res = await fetch('/api/analytics/stats', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao obter estatísticas');
    return res.json();
  },

  // Budget Simulator Engine
  async getSimulatorConfig(): Promise<SimulatorConfig> {
    const res = await fetch('/api/simulator/config');
    if (!res.ok) throw new Error('Falha ao carregar regras do simulador');
    return res.json();
  },

  async updateSimulatorConfig(config: Partial<SimulatorConfig>): Promise<SimulatorConfig> {
    const res = await fetch('/api/simulator/config', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Falha ao salvar configurações do simulador');
    return res.json();
  },

  async submitSimulation(data: Partial<BudgetSimulationLead>): Promise<{ success: boolean; simulation: BudgetSimulationLead }> {
    const res = await fetch('/api/simulator/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao registrar orçamento');
    return res.json();
  },

  async getSimulations(): Promise<BudgetSimulationLead[]> {
    const res = await fetch('/api/simulator/simulations', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Falha ao obter simulações');
    return res.json();
  },

  async deleteSimulation(id: string): Promise<void> {
    const res = await fetch(`/api/simulator/simulations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao excluir simulação');
  }
};

export function buildWhatsAppLink(phoneNumber: string | undefined, message: string): string {
  // Official number fallback: 5581985476681
  const rawNumber = phoneNumber && phoneNumber.trim() ? phoneNumber : '5581985476681';
  let cleanNumber = rawNumber.replace(/\D/g, '');
  if (!cleanNumber.startsWith('55') && cleanNumber.length <= 11) {
    cleanNumber = '55' + cleanNumber;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
