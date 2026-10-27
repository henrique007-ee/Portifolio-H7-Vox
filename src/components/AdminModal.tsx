import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Lock, 
  Film, 
  Briefcase, 
  Settings as SettingsIcon, 
  Users, 
  MessageSquare, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  LogOut, 
  AlertCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Instagram,
  Tag,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  Eye,
  EyeOff,
  Calculator,
  Upload,
  FileText
} from 'lucide-react';
import { FileUploadBox } from './FileUploadBox';
import { api, authStorage, buildWhatsAppLink } from '../services/api';
import type { 
  Project, 
  ServiceItem, 
  Testimonial, 
  Brand, 
  BackstageItem, 
  SiteSettings, 
  BriefingLead,
  CategoryItem,
  SimulatorConfig,
  BudgetSimulationLead
} from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  projects: Project[];
  categories: CategoryItem[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  brands: Brand[];
  backstage: BackstageItem[];
  onRefreshData: () => Promise<void>;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

type TabType = 
  | 'visao-geral' 
  | 'projetos' 
  | 'instagram' 
  | 'marcas' 
  | 'categorias' 
  | 'servicos' 
  | 'bastidores' 
  | 'depoimentos' 
  | 'lixeira' 
  | 'leads' 
  | 'simulador' 
  | 'configuracoes';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  projects,
  categories,
  services,
  testimonials,
  brands,
  backstage,
  onRefreshData,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('visao-geral');

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Global Feedback / Toast with Undo
  const [toast, setToast] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
    undoAction?: () => Promise<void>;
  } | null>(null);

  // Trash projects
  const [trashProjects, setTrashProjects] = useState<Project[]>([]);
  const [isLoadingTrash, setIsLoadingTrash] = useState(false);

  // Search & Filter for Projects
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('Todas');
  const [projectStatusFilter, setProjectStatusFilter] = useState('Todos');

  // Project Form State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Delete Confirmation Modal for Projects (Move to Trash)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  // Permanent Delete Modal
  const [permanentDeleteProject, setPermanentDeleteProject] = useState<Project | null>(null);
  const [isPermanentDeleting, setIsPermanentDeleting] = useState(false);

  // Empty Trash Modal
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false);
  const [showEmptyTrashConfirm, setShowEmptyTrashConfirm] = useState(false);

  // Instagram Video Importer State
  const [instagramForm, setInstagramForm] = useState({
    url: '',
    title: '',
    client: '',
    category: 'Reels e redes sociais',
    description: '',
    services: 'Edição de Reels, Storymaker',
    year: String(new Date().getFullYear()),
    featured: true,
    published: true,
    thumbnail: '',
  });
  const [instagramValidating, setInstagramValidating] = useState(false);
  const [instagramError, setInstagramError] = useState('');
  const [instagramValidatedCode, setInstagramValidatedCode] = useState('');

  // Brand Management State
  const [editingBrand, setEditingBrand] = useState<Partial<Brand> | null>(null);
  const [isBrandFormOpen, setIsBrandFormOpen] = useState(false);
  const [brandUsageData, setBrandUsageData] = useState<{
    brand: Brand;
    inUse: boolean;
    projectCount: number;
    projectTitles: string[];
  } | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isProcessingBrandDelete, setIsProcessingBrandDelete] = useState(false);

  // Category Management State
  const [categoryList, setCategoryList] = useState<CategoryItem[]>(categories);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Leads
  const [leads, setLeads] = useState<BriefingLead[]>([]);

  // Settings
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Password Change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passFeedback, setPassFeedback] = useState('');

  // Simulator & Internal Pricing State
  const [simulatorConfig, setSimulatorConfig] = useState<SimulatorConfig | null>(null);
  const [simulations, setSimulations] = useState<BudgetSimulationLead[]>([]);
  const [isSavingSimulator, setIsSavingSimulator] = useState(false);
  const [isLoadingSimulator, setIsLoadingSimulator] = useState(false);

  // Backstage Management State
  const [backstageToDelete, setBackstageToDelete] = useState<BackstageItem | null>(null);
  const [isDeletingBackstage, setIsDeletingBackstage] = useState(false);
  const [showClearAllBackstageConfirm, setShowClearAllBackstageConfirm] = useState(false);
  const [isClearingBackstage, setIsClearingBackstage] = useState(false);
  const [editingBackstage, setEditingBackstage] = useState<Partial<BackstageItem> | null>(null);
  const [isBackstageFormOpen, setIsBackstageFormOpen] = useState(false);
  const [isSavingBackstage, setIsSavingBackstage] = useState(false);

  // Testimonial Management State
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [isDeletingTestimonial, setIsDeletingTestimonial] = useState(false);
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);

  // Sync settings when props change
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  // Load trash projects, leads and simulator data when logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      loadTrashProjects();
      loadLeads();
      loadSimulatorData();
    }
  }, [isAdminLoggedIn]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success', undoAction?: () => Promise<void>) => {
    setToast({ text, type, undoAction });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 6000);
  };

  const loadTrashProjects = async () => {
    setIsLoadingTrash(true);
    try {
      const data = await api.getTrashProjects();
      setTrashProjects(data);
    } catch (err) {
      console.error('Erro ao carregar lixeira:', err);
    } finally {
      setIsLoadingTrash(false);
    }
  };

  const loadLeads = async () => {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSimulatorData = async () => {
    setIsLoadingSimulator(true);
    try {
      const [cfg, sims] = await Promise.all([
        api.getSimulatorConfig(),
        api.getSimulations().catch(() => [])
      ]);
      setSimulatorConfig(cfg);
      setSimulations(sims);
    } catch (err) {
      console.error('Erro ao carregar dados do simulador:', err);
    } finally {
      setIsLoadingSimulator(false);
    }
  };

  const handleSaveSimulator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorConfig) return;
    setIsSavingSimulator(true);
    try {
      const updated = await api.updateSimulatorConfig(simulatorConfig);
      setSimulatorConfig(updated);
      showToast('Configurações e regras do simulador salvas com sucesso!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar regras do simulador', 'error');
    } finally {
      setIsSavingSimulator(false);
    }
  };

  const handleDeleteSimulation = async (id: string) => {
    try {
      await api.deleteSimulation(id);
      setSimulations(prev => prev.filter(s => s.id !== id));
      showToast('Simulação removida.');
    } catch (err: any) {
      showToast('Erro ao remover simulação', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await api.login(passwordInput);
      setIsAdminLoggedIn(true);
      setPasswordInput('');
      await onRefreshData();
      await loadTrashProjects();
      showToast('Login realizado com sucesso! Bem-vindo ao painel.');
    } catch (err: any) {
      setLoginError(err.message || 'Senha incorreta.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    authStorage.clearToken();
    setIsAdminLoggedIn(false);
    showToast('Sessão encerrada com sucesso.', 'info');
  };

  // --- Project Real Deletion from Database ---
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    const targetProject = projectToDelete;

    try {
      await api.deleteProject(targetProject.id);
      setProjectToDelete(null);
      await onRefreshData();
      await loadTrashProjects();
      showToast(`Projeto "${targetProject.title}" excluído com sucesso!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir projeto do banco de dados.', 'error');
    } finally {
      setIsDeletingProject(false);
    }
  };

  // --- Optional Soft Deletion (Move to Trash) ---
  const handleConfirmMoveToTrash = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    const targetProject = projectToDelete;

    try {
      await api.moveToTrash(targetProject.id);
      setProjectToDelete(null);
      await onRefreshData();
      await loadTrashProjects();
      showToast(`Projeto "${targetProject.title}" movido para a lixeira com sucesso.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao mover projeto para a lixeira.', 'error');
    } finally {
      setIsDeletingProject(false);
    }
  };

  // --- Project Restore from Trash ---
  const handleRestoreProject = async (proj: Project) => {
    try {
      await api.restoreFromTrash(proj.id);
      await onRefreshData();
      await loadTrashProjects();
      showToast(`Projeto "${proj.title}" restaurado para o portfólio ativo!`);
    } catch (err: any) {
      showToast(err.message || 'Erro ao restaurar projeto.', 'error');
    }
  };

  // --- Permanent Delete ---
  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeleteProject) return;
    setIsPermanentDeleting(true);
    try {
      await api.deleteProjectPermanent(permanentDeleteProject.id);
      setPermanentDeleteProject(null);
      await loadTrashProjects();
      showToast(`Projeto "${permanentDeleteProject.title}" excluído definitivamente do banco de dados.`);
    } catch (err: any) {
      showToast(err.message || 'Erro na exclusão definitiva.', 'error');
    } finally {
      setIsPermanentDeleting(false);
    }
  };

  // --- Empty Trash ---
  const handleEmptyTrash = async () => {
    setIsEmptyingTrash(true);
    try {
      const res = await api.emptyTrash();
      setShowEmptyTrashConfirm(false);
      await loadTrashProjects();
      showToast(res.message || 'Lixeira esvaziada com sucesso.');
    } catch (err: any) {
      showToast(err.message || 'Erro ao esvaziar lixeira.', 'error');
    } finally {
      setIsEmptyingTrash(false);
    }
  };

  // --- Save Project ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title?.trim()) {
      showToast('O título do projeto é obrigatório.', 'error');
      return;
    }
    setIsSavingProject(true);
    try {
      await api.saveProject(editingProject);
      await onRefreshData();
      setIsProjectFormOpen(false);
      setEditingProject(null);
      showToast('Projeto salvo com sucesso no banco de dados!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar projeto.', 'error');
    } finally {
      setIsSavingProject(false);
    }
  };

  // --- Instagram Video Importer Submission ---
  const handleImportInstagramVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstagramError('');

    if (!instagramForm.url.trim()) {
      setInstagramError('Insira o link do Reel ou publicação do Instagram.');
      return;
    }

    setInstagramValidating(true);
    try {
      // 1. Validate URL with backend
      const validation = await api.validateInstagram(instagramForm.url);

      // 2. Prepare new project
      const newProj: Partial<Project> = {
        title: instagramForm.title.trim() || `Reel Instagram @h7.vox (${validation.code})`,
        client: instagramForm.client.trim() || 'H7.VOX',
        category: instagramForm.category,
        year: instagramForm.year,
        description: instagramForm.description.trim() || 'Vídeo produzido para redes sociais com ritmo dinâmico e narrativa visual.',
        thumbnail: instagramForm.thumbnail.trim() || '/assets/logo_web.png',
        videoUrl: validation.cleanUrl,
        videoType: 'instagram',
        instagramUrl: validation.cleanUrl,
        instagramCode: validation.code,
        aspectRatio: '9:16', // Instagram Reels are natively vertical!
        services: instagramForm.services.split(',').map((s) => s.trim()).filter(Boolean),
        credits: 'Captação e Edição: Endson Henrique (@h7.vox)',
        order: projects.length + 1,
        featured: instagramForm.featured,
        published: instagramForm.published,
      };

      await api.saveProject(newProj);
      await onRefreshData();

      // Reset form
      setInstagramForm({
        url: '',
        title: '',
        client: '',
        category: 'Reels e redes sociais',
        description: '',
        services: 'Edição de Reels, Storymaker',
        year: String(new Date().getFullYear()),
        featured: true,
        published: true,
        thumbnail: '',
      });
      setInstagramValidatedCode('');
      showToast('Reel do Instagram adicionado com sucesso ao portfólio!');
      setActiveTab('projetos');
    } catch (err: any) {
      setInstagramError(err.message || 'Link inválido. Insira uma URL como https://www.instagram.com/reel/C3abc123/.');
    } finally {
      setInstagramValidating(false);
    }
  };

  // --- Brand Usage Check & Safe Deletion ---
  const handleInitiateDeleteBrand = async (brand: Brand) => {
    try {
      const usage = await api.checkBrandUsage(brand.id);
      if (usage.inUse) {
        setBrandUsageData(usage);
        setBrandToDelete(brand);
      } else {
        await api.deleteBrand(brand.id);
        await onRefreshData();
        showToast(`Marca "${brand.name}" excluída.`);
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao verificar vínculos da marca.', 'error');
    }
  };

  const handleResolveBrandDelete = async (action: 'hide' | 'unlink-and-delete' | 'cancel') => {
    if (!brandToDelete) return;
    setIsProcessingBrandDelete(true);

    try {
      if (action === 'hide') {
        // Just set active = false
        await api.saveBrand({ id: brandToDelete.id, active: false });
        await onRefreshData();
        showToast(`Marca "${brandToDelete.name}" foi ocultada do site público.`);
      } else if (action === 'unlink-and-delete') {
        await api.deleteBrand(brandToDelete.id, { unlink: true });
        await onRefreshData();
        showToast(`Marca "${brandToDelete.name}" excluída e desvinculada dos projetos.`);
      }
      setBrandUsageData(null);
      setBrandToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao processar exclusão da marca.', 'error');
    } finally {
      setIsProcessingBrandDelete(false);
    }
  };

  // --- Backstage Actions ---
  const handleConfirmDeleteBackstage = async () => {
    if (!backstageToDelete) return;
    setIsDeletingBackstage(true);
    try {
      await api.deleteBackstage(backstageToDelete.id);
      await onRefreshData();
      showToast(`Item "${backstageToDelete.title || 'Bastidor'}" excluído com sucesso.`);
      setBackstageToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir item de bastidor', 'error');
    } finally {
      setIsDeletingBackstage(false);
    }
  };

  const handleConfirmClearAllBackstage = async () => {
    setIsClearingBackstage(true);
    try {
      await api.clearAllBackstage();
      await onRefreshData();
      showToast('Todos os bastidores foram excluídos.');
      setShowClearAllBackstageConfirm(false);
    } catch (err: any) {
      showToast(err.message || 'Erro ao limpar bastidores', 'error');
    } finally {
      setIsClearingBackstage(false);
    }
  };

  const handleSaveBackstage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBackstage?.title?.trim() || !editingBackstage?.mediaUrl?.trim()) {
      showToast('Preencha o título e a URL da foto/vídeo.', 'error');
      return;
    }
    setIsSavingBackstage(true);
    try {
      await api.saveBackstage(editingBackstage);
      await onRefreshData();
      showToast(editingBackstage.id ? 'Item de bastidor atualizado!' : 'Novo item adicionado aos bastidores!');
      setIsBackstageFormOpen(false);
      setEditingBackstage(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar item de bastidor', 'error');
    } finally {
      setIsSavingBackstage(false);
    }
  };

  // --- Testimonial Actions ---
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name?.trim() || !editingTestimonial?.text?.trim()) {
      showToast('Preencha o nome do cliente e o texto do depoimento.', 'error');
      return;
    }
    setIsSavingTestimonial(true);
    try {
      await api.saveTestimonial(editingTestimonial);
      await onRefreshData();
      showToast(editingTestimonial.id ? 'Depoimento atualizado!' : 'Novo depoimento adicionado com sucesso!');
      setIsTestimonialFormOpen(false);
      setEditingTestimonial(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar depoimento', 'error');
    } finally {
      setIsSavingTestimonial(false);
    }
  };

  const handleConfirmDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    setIsDeletingTestimonial(true);
    try {
      await api.deleteTestimonial(testimonialToDelete.id);
      await onRefreshData();
      showToast(`Depoimento de "${testimonialToDelete.name}" excluído.`);
      setTestimonialToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir depoimento', 'error');
    } finally {
      setIsDeletingTestimonial(false);
    }
  };

  // --- Category Actions ---
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newCat: CategoryItem = {
      id: 'cat-' + Date.now(),
      name: newCategoryName.trim(),
      order: categoryList.length + 1,
      active: true,
    };
    const updated = [...categoryList, newCat];
    try {
      await api.updateCategories(updated);
      setCategoryList(updated);
      setNewCategoryName('');
      await onRefreshData();
      showToast(`Categoria "${newCat.name}" adicionada.`);
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar categoria.', 'error');
    }
  };

  const handleToggleCategory = async (catId: string, active: boolean) => {
    const updated = categoryList.map((c) => (c.id === catId ? { ...c, active } : c));
    try {
      await api.updateCategories(updated);
      setCategoryList(updated);
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --- Settings Save ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings(settingsForm);
      await onRefreshData();
      showToast('Configurações do site salvas com sucesso no banco de dados!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar configurações.', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --- Password Change ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback('');
    try {
      await api.changePassword(currentPass, newPass);
      setPassFeedback('Senha de administrador atualizada com sucesso!');
      setCurrentPass('');
      setNewPass('');
      showToast('Senha alterada.');
    } catch (err: any) {
      setPassFeedback(err.message || 'Erro ao alterar senha.');
    }
  };

  // Filtered active projects for table
  const filteredActiveProjects = useMemo(() => {
    return projects.filter((p) => {
      if (p.inTrash) return false;
      if (projectSearch) {
        const q = projectSearch.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchClient = (p.client || '').toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchTitle && !matchClient && !matchCat) return false;
      }
      if (projectCategoryFilter !== 'Todas' && p.category !== projectCategoryFilter) {
        return false;
      }
      if (projectStatusFilter === 'Publicado' && !p.published) return false;
      if (projectStatusFilter === 'Rascunho' && p.published) return false;
      return true;
    });
  }, [projects, projectSearch, projectCategoryFilter, projectStatusFilter]);

  // --- Generate Organized PDF Report of Everything Added ---
  const handleGenerateOrganizedPDF = () => {
    const activeProjects = projects.filter((p) => !p.inTrash);
    const activeBrands = brands.filter((b) => !b.inTrash);
    const generatedAt = new Date().toLocaleString('pt-BR');

    const escapeHtml = (str?: string | number | null) => {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório Geral H7.VOX - ${escapeHtml(settings.ownerName || 'Endson Henrique')}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
    }
    .header {
      background: #050505;
      color: #FFFFFF;
      padding: 20px 24px;
      border-radius: 12px;
      border-bottom: 4px solid #08CC07;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }
    .header-brand h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.04em;
      color: #08CC07;
    }
    .header-brand p {
      margin: 4px 0 0;
      font-size: 11px;
      color: #D1D5DB;
    }
    .header-meta {
      text-align: right;
      font-size: 10px;
      color: #9CA3AF;
    }
    .header-meta strong {
      color: #FFFFFF;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .summary-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-left: 3px solid #08CC07;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .summary-card .label {
      font-size: 9px;
      text-transform: uppercase;
      color: #64748B;
      font-weight: 700;
    }
    .summary-card .value {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 2px;
    }
    .section {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0F172A;
      background: #F1F5F9;
      border-left: 4px solid #08CC07;
      padding: 7px 12px;
      margin: 0 0 10px 0;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    th, td {
      border: 1px solid #CBD5E1;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
      font-size: 10px;
    }
    th {
      background: #0F172A;
      color: #FFFFFF;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.04em;
    }
    tr:nth-child(even) td {
      background: #F8FAFC;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      background: #DCFCE7;
      color: #15803D;
    }
    .badge-gray {
      background: #E2E8F0;
      color: #475569;
    }
    .empty {
      padding: 10px;
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      border-radius: 6px;
      color: #64748B;
      font-style: italic;
    }
    .footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #E2E8F0;
      text-align: center;
      font-size: 9px;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-brand">
      <h1>H7.VOX AUDIOVISUAL — RELATÓRIO DE GESTÃO</h1>
      <p>${escapeHtml(settings.ownerName || 'Endson Henrique')} • ${escapeHtml(settings.roleSubtitle || 'Editor de Vídeo • Filmmaker • Storymaker')}</p>
    </div>
    <div class="header-meta">
      <div>Gerado em: <strong>${escapeHtml(generatedAt)}</strong></div>
      <div>WhatsApp: <strong>(81) 98547-6681</strong></div>
      <div>E-mail: <strong>${escapeHtml(settings.email || 'endsonhenrique13@gmail.com')}</strong></div>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Projetos no Catálogo</div>
      <div class="value">${activeProjects.length}</div>
    </div>
    <div class="summary-card">
      <div class="label">Marcas Parceiras</div>
      <div class="value">${activeBrands.length}</div>
    </div>
    <div class="summary-card">
      <div class="label">Serviços & Categorias</div>
      <div class="value">${services.length} / ${categoryList.length}</div>
    </div>
    <div class="summary-card">
      <div class="label">Briefings & Orçamentos</div>
      <div class="value">${leads.length + simulations.length}</div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">1. Projetos Audiovisuais & Reels Cadastrados (${activeProjects.length})</h2>
    ${
      activeProjects.length === 0
        ? '<div class="empty">Nenhum projeto cadastrado até o momento.</div>'
        : `<table>
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Cliente / Marca</th>
                <th>Categoria</th>
                <th>Formato</th>
                <th>Ano</th>
                <th>Status</th>
                <th>Serviços / Descrição</th>
              </tr>
            </thead>
            <tbody>
              ${activeProjects
                .map(
                  (p, idx) => `<tr>
                    <td>${idx + 1}</td>
                    <td><strong>${escapeHtml(p.title)}</strong>${p.featured ? ' <span class="badge">Destaque</span>' : ''}</td>
                    <td>${escapeHtml(p.client || '-')}</td>
                    <td>${escapeHtml(p.category)}</td>
                    <td>${escapeHtml(p.aspectRatio || '16:9')}${p.videoType === 'instagram' ? ' (Reel)' : ''}</td>
                    <td>${escapeHtml(p.year)}</td>
                    <td><span class="badge ${p.published ? '' : 'badge-gray'}">${p.published ? 'Publicado' : 'Rascunho'}</span></td>
                    <td>
                      <div><strong>Serviços:</strong> ${escapeHtml((p.services || []).join(', '))}</div>
                      ${p.description ? `<div>${escapeHtml(p.description)}</div>` : ''}
                    </td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>`
    }
  </div>

  <div class="section">
    <h2 class="section-title">2. Marcas & Clientes Parceiros (${activeBrands.length})</h2>
    ${
      activeBrands.length === 0
        ? '<div class="empty">Nenhuma marca cadastrada até o momento.</div>'
        : `<table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome da Marca</th>
                <th>Descrição / Segmento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${activeBrands
                .map(
                  (b, idx) => `<tr>
                    <td>${idx + 1}</td>
                    <td><strong>${escapeHtml(b.name)}</strong></td>
                    <td>${escapeHtml(b.description || '-')}</td>
                    <td><span class="badge ${b.active ? '' : 'badge-gray'}">${b.active ? 'Ativa' : 'Oculta'}</span></td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>`
    }
  </div>

  <div class="section">
    <h2 class="section-title">3. Serviços & Soluções (${services.length})</h2>
    ${
      services.length === 0
        ? '<div class="empty">Nenhum serviço cadastrado.</div>'
        : `<table>
            <thead>
              <tr>
                <th>Cód.</th>
                <th>Serviço</th>
                <th>Descrição</th>
                <th>Entregas Inclusas</th>
              </tr>
            </thead>
            <tbody>
              ${services
                .map(
                  (s) => `<tr>
                    <td><strong>${escapeHtml(s.code)}</strong></td>
                    <td><strong>${escapeHtml(s.title)}</strong></td>
                    <td>${escapeHtml(s.description)}</td>
                    <td>${escapeHtml((s.deliverables || []).join(' • '))}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>`
    }
  </div>

  <div class="section">
    <h2 class="section-title">4. Categorias do Portfólio (${categoryList.length})</h2>
    ${
      categoryList.length === 0
        ? '<div class="empty">Nenhuma categoria cadastrada.</div>'
        : `<table>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Nome da Categoria</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${categoryList
                .map(
                  (c, idx) => `<tr>
                    <td>${idx + 1}</td>
                    <td><strong>${escapeHtml(c.name)}</strong></td>
                    <td><span class="badge ${c.active ? '' : 'badge-gray'}">${c.active ? 'Ativa' : 'Inativa'}</span></td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>`
    }
  </div>

  <div class="section">
    <h2 class="section-title">5. Depoimentos de Clientes (${testimonials.length})</h2>
    ${
      testimonials.length === 0
        ? '<div class="empty">Nenhum depoimento cadastrado até o momento.</div>'
        : `<table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Cargo / Empresa</th>
                <th>Avaliação</th>
                <th>Depoimento</th>
              </tr>
            </thead>
            <tbody>
              ${testimonials
                .map(
                  (t) => `<tr>
                    <td><strong>${escapeHtml(t.name)}</strong></td>
                    <td>${escapeHtml(t.role || '')}${t.company ? ` • ${escapeHtml(t.company)}` : ''}</td>
                    <td>${escapeHtml(t.rating || 5)} ★</td>
                    <td>"${escapeHtml(t.text)}"</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>`
    }
  </div>

  <div class="section">
    <h2 class="section-title">6. Solicitações de Orçamento & Briefings Recebidos (${simulations.length + leads.length})</h2>
    ${
      simulations.length === 0 && leads.length === 0
        ? '<div class="empty">Nenhuma solicitação ou briefing recebido até o momento.</div>'
        : `<table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente / Empresa</th>
                <th>Contato / Cidade</th>
                <th>Serviços / Detalhes Solicitados</th>
              </tr>
            </thead>
            <tbody>
              ${simulations
                .map(
                  (sim) => `<tr>
                    <td>${escapeHtml(sim.createdAt ? new Date(sim.createdAt).toLocaleDateString('pt-BR') : '-')}</td>
                    <td><strong>${escapeHtml(sim.clientName)}</strong>${sim.companyName ? `<br/>${escapeHtml(sim.companyName)}` : ''}</td>
                    <td>${escapeHtml(sim.instagram || '-')}<br/>${escapeHtml(sim.city || '-')}</td>
                    <td>
                      <div><strong>Pacote/Escopo:</strong> ${escapeHtml(sim.packageSelected || 'Personalizado')}</div>
                      <div><strong>Categorias:</strong> ${escapeHtml((sim.categories || []).join(', '))}</div>
                      ${sim.observations ? `<div><strong>Obs:</strong> ${escapeHtml(sim.observations)}</div>` : ''}
                    </td>
                  </tr>`
                )
                .join('')}
              ${leads
                .map(
                  (lead) => `<tr>
                    <td>${escapeHtml(lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR') : '-')}</td>
                    <td><strong>${escapeHtml(lead.name)}</strong>${lead.companyOrProject ? `<br/>${escapeHtml(lead.companyOrProject)}` : ''}</td>
                    <td>Prazo: ${escapeHtml(lead.estimatedDate || 'A definir')}</td>
                    <td>
                      <div><strong>Serviço:</strong> ${escapeHtml(lead.service)}</div>
                      <div>${escapeHtml(lead.description)}</div>
                    </td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>`
    }
  </div>

  <div class="footer">
    Documento gerado automaticamente pelo Painel de Gestão H7.VOX Audiovisual • ${escapeHtml(settings.ownerName || 'Endson Henrique')} • WhatsApp (81) 98547-6681
  </div>
</body>
</html>`;

    const existingIframe = document.getElementById('h7-pdf-print-frame');
    if (existingIframe && existingIframe.parentNode) {
      existingIframe.parentNode.removeChild(existingIframe);
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'h7-pdf-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      showToast('Preparando PDF organizado com todos os dados cadastrados...', 'info');
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 350);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <img src="/assets/logo_web.png" alt="H7.VOX" className="h-8 sm:h-9 w-auto object-contain" />
            <div className="hidden sm:block border-l border-white/10 pl-3">
              <h2 className="text-sm sm:text-base font-bold text-white font-display">
                Painel Administrativo H7.VOX
              </h2>
              <span className="text-[11px] text-[#08CC07] font-mono">
                {isAdminLoggedIn ? 'Autenticado • Endson Henrique' : 'Acesso Restrito'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdminLoggedIn && (
              <>
                <button
                  type="button"
                  onClick={handleGenerateOrganizedPDF}
                  title="Gerar PDF organizado com tudo que foi adicionado"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08CC07] hover:bg-[#0ae309] text-[#050505] text-xs font-bold transition-colors cursor-pointer shadow-md shadow-[#08CC07]/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Gerar PDF</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 text-xs font-semibold border border-white/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              aria-label="Fechar painel"
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast / Feedback Banner with Undo */}
        {toast && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
              toast.type === 'success'
                ? 'bg-[#08CC07]/20 text-[#08CC07] border-b border-[#08CC07]/40'
                : toast.type === 'error'
                ? 'bg-red-500/20 text-red-300 border-b border-red-500/40'
                : 'bg-blue-500/20 text-blue-300 border-b border-blue-500/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{toast.text}</span>
            </div>

            <div className="flex items-center gap-3">
              {toast.undoAction && (
                <button
                  onClick={async () => {
                    if (toast.undoAction) {
                      await toast.undoAction();
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 text-white text-[11px] font-mono underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Desfazer</span>
                </button>
              )}
              <button onClick={() => setToast(null)} className="text-white/60 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Panel Main Container */}
        {!isAdminLoggedIn ? (
          /* Login Screen */
          <div className="p-8 sm:p-16 max-w-md mx-auto text-center w-full">
            <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center mx-auto mb-6 p-2">
              <img src="/assets/logo_web.png" alt="H7.VOX" className="w-full h-full object-contain" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-2">
              Área do Criador Audiovisual
            </h3>
            <p className="text-xs sm:text-sm text-white/50 mb-8">
              Acesso exclusivo para Endson Henrique gerenciar projetos, vídeos do Instagram, marcas e contatos da H7.VOX.
            </p>

            {loginError && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Digite sua senha de administrador..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
              />

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-sm hover:bg-[#0ae309] transition-all disabled:opacity-50"
              >
                {isLoggingIn ? 'Verificando credenciais...' : 'Acessar Painel H7.VOX'}
              </button>
            </form>
          </div>
        ) : (
          /* Full Logged-in Panel */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs Navigation Bar */}
            <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-white/10 bg-[#141414] overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('visao-geral')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'visao-geral' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Visão Geral</span>
              </button>

              <button
                onClick={() => setActiveTab('projetos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'projetos' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Projetos ({projects.filter((p) => !p.inTrash).length})</span>
              </button>

              <button
                onClick={() => setActiveTab('instagram')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'instagram' ? 'bg-[#833AB4] text-white' : 'text-[#E1306C] hover:bg-[#833AB4]/10'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>+ Vídeo do Instagram</span>
              </button>

              <button
                onClick={() => setActiveTab('categorias')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'categorias' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Categorias ({categoryList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('marcas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'marcas' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Marcas & Clientes ({brands.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('lixeira')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'lixeira'
                    ? 'bg-red-500 text-white'
                    : trashProjects.length > 0
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Lixeira ({trashProjects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'leads' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Briefings ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('bastidores')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'bastidores' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Bastidores ({backstage.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('depoimentos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'depoimentos' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Depoimentos ({testimonials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('simulador')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'simulador' ? 'bg-[#08CC07] text-[#080808]' : 'text-[#08CC07] hover:bg-[#08CC07]/10'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulador & Preços</span>
              </button>

              <button
                onClick={() => setActiveTab('configuracoes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'configuracoes' ? 'bg-[#08CC07] text-[#080808]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Configurações</span>
              </button>
            </div>

            {/* Tab Views Body */}
            <div className="p-4 sm:p-8 overflow-y-auto flex-1">
              {/* TAB: VISÃO GERAL */}
              {activeTab === 'visao-geral' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      Visão Geral do Portfólio H7.VOX
                    </h3>
                    <p className="text-xs text-white/50">
                      Resumo da sua presença audiovisual, projetos ativos, reels e solicitações de clientes.
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 flex flex-col justify-between">
                      <span className="text-xs font-mono text-white/50">Projetos Ativos</span>
                      <div className="text-3xl font-black text-white font-mono mt-2">
                        {projects.filter((p) => !p.inTrash && p.published).length}
                      </div>
                      <span className="text-[11px] text-[#08CC07] mt-1">Visíveis no portfólio</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 flex flex-col justify-between">
                      <span className="text-xs font-mono text-white/50">Reels / Verticais</span>
                      <div className="text-3xl font-black text-[#E1306C] font-mono mt-2">
                        {projects.filter((p) => !p.inTrash && (p.aspectRatio === '9:16' || p.videoType === 'instagram')).length}
                      </div>
                      <span className="text-[11px] text-white/40 mt-1">Formato 9:16</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 flex flex-col justify-between">
                      <span className="text-xs font-mono text-white/50">Marcas Parceiras</span>
                      <div className="text-3xl font-black text-white font-mono mt-2">
                        {brands.filter((b) => b.active).length}
                      </div>
                      <span className="text-[11px] text-white/40 mt-1">Exibidas no rodapé</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 flex flex-col justify-between">
                      <span className="text-xs font-mono text-white/50">Lixeira</span>
                      <div className="text-3xl font-black text-red-400 font-mono mt-2">
                        {trashProjects.length}
                      </div>
                      <span className="text-[11px] text-white/40 mt-1">Recuperáveis</span>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('instagram')}
                      className="p-5 rounded-xl bg-gradient-to-r from-[#833AB4]/20 to-[#FD1D1D]/10 border border-[#833AB4]/40 hover:border-[#833AB4] text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#E1306C] uppercase font-bold">
                          <Instagram className="w-4 h-4" />
                          <span>Importar Reel</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">Adicionar via Link do Instagram</h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/60" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingProject({
                          title: '',
                          client: '',
                          category: 'Eventos',
                          year: String(new Date().getFullYear()),
                          description: '',
                          thumbnail: '',
                          videoUrl: '',
                          aspectRatio: '16:9',
                          services: ['Edição de Vídeo'],
                          credits: 'Direção e Edição: Endson Henrique',
                          results: '',
                          order: projects.length + 1,
                          featured: false,
                          published: true,
                        });
                        setIsProjectFormOpen(true);
                        setActiveTab('projetos');
                      }}
                      className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#08CC07]/50 text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#08CC07] uppercase font-bold">
                          <Film className="w-4 h-4" />
                          <span>Novo Projeto</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">Cadastrar Filme ou Job</h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/60" />
                    </button>

                    <button
                      onClick={() => setActiveTab('configuracoes')}
                      className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase font-bold">
                          <SettingsIcon className="w-4 h-4" />
                          <span>Contatos Oficiais</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">WhatsApp & Instagram</h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  {/* Export Organized PDF Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#08CC07]/15 via-[#111111] to-[#111111] border border-[#08CC07]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#08CC07] uppercase font-bold mb-1">
                        <FileText className="w-4 h-4" />
                        <span>EXPORTAÇÃO COMPLETA • RELATÓRIO H7.VOX</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        Gerar PDF Organizado com Tudo Adicionado
                      </h4>
                      <p className="text-xs text-white/60 mt-0.5">
                        Exporta um documento PDF estruturado com todos os seus projetos, reels, marcas parceiras, categorias, serviços, depoimentos e briefings recebidos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateOrganizedPDF}
                      className="px-5 py-3 rounded-xl bg-[#08CC07] hover:bg-[#0ae309] text-[#050505] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer shadow-lg shadow-[#08CC07]/20"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Baixar / Imprimir PDF Completo</span>
                    </button>
                  </div>

                  {/* Official Credentials Box */}
                  <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/10 space-y-2 text-xs font-mono">
                    <span className="text-[#08CC07] font-bold block uppercase tracking-wider">
                      CONFIGURAÇÃO OFICIAL H7.VOX
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-white/70">
                      <div>WhatsApp: <strong>(81) 98547-6681</strong></div>
                      <div>Instagram: <strong>@h7.vox</strong></div>
                      <div>Profissional: <strong>Endson Henrique</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PROJETOS */}
              {activeTab === 'projetos' && (
                <div className="space-y-6">
                  {/* Top Bar with Search & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">
                        Catálogo de Projetos ({filteredActiveProjects.length})
                      </h3>
                      <p className="text-xs text-white/50">
                        Gerencie seus filmes, clipes e produções. Exclua para a lixeira com segurança e restauração.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setEditingProject({
                            title: '',
                            client: '',
                            category: 'Eventos',
                            year: String(new Date().getFullYear()),
                            description: '',
                            thumbnail: '',
                            videoUrl: '',
                            aspectRatio: '16:9',
                            services: ['Edição de Vídeo'],
                            credits: 'Direção e Edição: Endson Henrique',
                            results: '',
                            order: projects.length + 1,
                            featured: false,
                            published: true,
                          });
                          setIsProjectFormOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs hover:bg-[#0ae309] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Novo Projeto</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('instagram')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#833AB4] text-white font-bold text-xs hover:opacity-90 transition-opacity"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>+ Reel do Instagram</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#151515] border border-white/5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        placeholder="Buscar por título ou cliente..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30"
                      />
                    </div>

                    <div>
                      <select
                        value={projectCategoryFilter}
                        onChange={(e) => setProjectCategoryFilter(e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="Todas">Todas as Categorias</option>
                        {categoryList.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        value={projectStatusFilter}
                        onChange={(e) => setProjectStatusFilter(e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="Todos">Todos os Status</option>
                        <option value="Publicado">Apenas Publicados</option>
                        <option value="Rascunho">Apenas Rascunhos</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Form Modal / Drawer */}
                  {isProjectFormOpen && editingProject && (
                    <div className="p-6 rounded-2xl bg-[#161616] border border-[#08CC07]/40 space-y-6 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Film className="w-4 h-4 text-[#08CC07]" />
                          <span>{editingProject.id ? 'Editar Projeto' : 'Novo Projeto Audiovisual'}</span>
                        </h4>
                        <button
                          onClick={() => {
                            setIsProjectFormOpen(false);
                            setEditingProject(null);
                          }}
                          className="text-white/40 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Título do Projeto *</label>
                            <input
                              type="text"
                              required
                              value={editingProject.title || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                              placeholder="Ex: Aftermovie Festival Sons"
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Cliente / Marca</label>
                            <input
                              type="text"
                              value={editingProject.client || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                              placeholder="Ex: Produtora Som & Luz"
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Categoria</label>
                            <select
                              value={editingProject.category || 'Eventos'}
                              onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            >
                              {categoryList.map((c) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Formato / Proporção</label>
                            <select
                              value={editingProject.aspectRatio || '16:9'}
                              onChange={(e) => setEditingProject({ ...editingProject, aspectRatio: e.target.value as '16:9' | '9:16' })}
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            >
                              <option value="16:9">16:9 (Horizontal / Cinema)</option>
                              <option value="9:16">9:16 (Vertical / Reels / Story)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Ano</label>
                            <input
                              type="text"
                              value={editingProject.year || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Ordem</label>
                            <input
                              type="number"
                              value={editingProject.order || 1}
                              onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Vídeo URL (YouTube, Vimeo, MP4 ou Reel)</label>
                            <input
                              type="text"
                              value={editingProject.videoUrl || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                              placeholder="Link do Reel, YouTube ou .mp4"
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <FileUploadBox
                            label="Thumbnail / Capa do Projeto"
                            sublabel="Selecione a imagem de capa diretamente do seu computador ou cole uma URL"
                            currentUrl={editingProject.thumbnail || ''}
                            onUrlChange={(url) => setEditingProject({ ...editingProject, thumbnail: url })}
                            aspect="video"
                            placeholder="Clique para selecionar imagem de capa no seu PC"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-white/70 mb-1">Descrição & Contexto</label>
                          <textarea
                            rows={3}
                            value={editingProject.description || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                            placeholder="Descreva a narrativa, os desafios e o objetivo do projeto..."
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Serviços (separados por vírgula)</label>
                            <input
                              type="text"
                              value={editingProject.services?.join(', ') || ''}
                              onChange={(e) => setEditingProject({
                                ...editingProject,
                                services: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              })}
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Créditos de Produção</label>
                            <input
                              type="text"
                              value={editingProject.credits || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, credits: e.target.value })}
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-white/70 mb-1">Resultados Reais</label>
                            <input
                              type="text"
                              value={editingProject.results || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, results: e.target.value })}
                              placeholder="Ex: +1.2M alcance"
                              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-6 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                            <input
                              type="checkbox"
                              checked={editingProject.featured || false}
                              onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                              className="accent-[#08CC07] w-4 h-4"
                            />
                            <span>Marcar como Destaque</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                            <input
                              type="checkbox"
                              checked={editingProject.published ?? true}
                              onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                              className="accent-[#08CC07] w-4 h-4"
                            />
                            <span>Publicado no Portfólio</span>
                          </label>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setIsProjectFormOpen(false);
                              setEditingProject(null);
                            }}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/70"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isSavingProject}
                            className="px-6 py-2 rounded-lg bg-[#08CC07] hover:bg-[#0ae309] text-xs font-bold text-[#080808] disabled:opacity-50"
                          >
                            {isSavingProject ? 'Salvando...' : 'Salvar Projeto'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Projects List Container */}
                  <div className="rounded-xl border border-white/10 overflow-hidden bg-[#141414]">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#1c1c1c] text-white/50 font-mono uppercase tracking-wider border-b border-white/10">
                          <tr>
                            <th className="p-3.5">Mídia</th>
                            <th className="p-3.5">Título & Cliente</th>
                            <th className="p-3.5">Categoria</th>
                            <th className="p-3.5">Formato</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredActiveProjects.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-white/40 font-mono">
                                Nenhum projeto encontrado com os filtros selecionados.
                              </td>
                            </tr>
                          ) : (
                            filteredActiveProjects.map((proj) => (
                              <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-3.5">
                                  <div className="w-12 h-12 rounded bg-black overflow-hidden shrink-0 border border-white/10">
                                    <img
                                      src={proj.thumbnail || '/assets/logo_web.png'}
                                      alt={proj.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className="font-bold text-white block">{proj.title}</span>
                                  <span className="text-white/40">{proj.client || 'H7.VOX'} · {proj.year}</span>
                                </td>
                                <td className="p-3.5 font-mono text-white/70">{proj.category}</td>
                                <td className="p-3.5 font-mono">
                                  {proj.videoType === 'instagram' ? (
                                    <span className="text-[#E1306C] flex items-center gap-1">
                                      <Instagram className="w-3 h-3" />
                                      <span>9:16 Reel</span>
                                    </span>
                                  ) : (
                                    <span className="text-[#08CC07]">{proj.aspectRatio}</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                      proj.published
                                        ? 'bg-[#08CC07]/15 text-[#08CC07] border border-[#08CC07]/30'
                                        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                    }`}
                                  >
                                    {proj.published ? 'Publicado' : 'Rascunho'}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProject(proj);
                                        setIsProjectFormOpen(true);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/90 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold border border-white/10"
                                      title="Editar dados do projeto"
                                      aria-label={`Editar projeto ${proj.title}`}
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Editar</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setProjectToDelete(proj)}
                                      className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
                                      title="Excluir este projeto"
                                      aria-label={`Excluir projeto ${proj.title}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                      <span>Excluir</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Responsive Cards View */}
                    <div className="md:hidden divide-y divide-white/10">
                      {filteredActiveProjects.length === 0 ? (
                        <div className="p-8 text-center text-white/40 font-mono text-xs">
                          Nenhum projeto encontrado com os filtros selecionados.
                        </div>
                      ) : (
                        filteredActiveProjects.map((proj) => (
                          <div key={proj.id} className="p-4 space-y-3 bg-[#141414] hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                                <img
                                  src={proj.thumbnail || '/assets/logo_web.png'}
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-bold text-white text-sm truncate">{proj.title}</h4>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                                      proj.published
                                        ? 'bg-[#08CC07]/15 text-[#08CC07] border border-[#08CC07]/30'
                                        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                    }`}
                                  >
                                    {proj.published ? 'Publicado' : 'Rascunho'}
                                  </span>
                                </div>
                                <p className="text-xs text-white/50 mt-0.5">
                                  {proj.client || 'H7.VOX'} · {proj.year}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono">
                                  <span className="text-[#08CC07] bg-[#08CC07]/10 px-2 py-0.5 rounded border border-[#08CC07]/20">
                                    {proj.category}
                                  </span>
                                  {proj.videoType === 'instagram' ? (
                                    <span className="text-[#E1306C] flex items-center gap-1">
                                      <Instagram className="w-3 h-3" />
                                      <span>9:16 Reel</span>
                                    </span>
                                  ) : (
                                    <span className="text-white/60">{proj.aspectRatio}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Mobile Action Buttons with Clear Red Delete Button */}
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProject(proj);
                                  setIsProjectFormOpen(true);
                                }}
                                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                                aria-label={`Editar projeto ${proj.title}`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Editar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setProjectToDelete(proj)}
                                className="py-2.5 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                                aria-label={`Excluir projeto ${proj.title}`}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                <span>Excluir</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VÍDEOS DO INSTAGRAM */}
              {activeTab === 'instagram' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#E1306C] uppercase font-bold mb-1">
                      <Instagram className="w-4 h-4" />
                      <span>INTEGRAÇÃO OFICIAL INSTAGRAM @H7.VOX</span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">
                      Adicionar Vídeo ou Reel do Instagram
                    </h3>
                    <p className="text-xs text-white/50">
                      Cole a URL do Reel do seu perfil (@h7.vox). O sistema valida o link, preserva a proporção 9:16 e integra ao portfólio.
                    </p>
                  </div>

                  {instagramError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{instagramError}</span>
                    </div>
                  )}

                  <form onSubmit={handleImportInstagramVideo} className="p-6 rounded-2xl bg-[#151515] border border-white/10 space-y-4 shadow-xl">
                    <div>
                      <label className="block text-xs font-mono text-white/80 uppercase tracking-wider mb-1.5">
                        Link da Publicação ou Reel do Instagram *
                      </label>
                      <div className="relative">
                        <Instagram className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#E1306C]" />
                        <input
                          type="url"
                          required
                          placeholder="https://www.instagram.com/reel/C3abc123/ ou https://www.instagram.com/p/..."
                          value={instagramForm.url}
                          onChange={(e) => {
                            setInstagramForm({ ...instagramForm, url: e.target.value });
                            setInstagramError('');
                          }}
                          className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#E1306C]"
                        />
                      </div>
                      <span className="text-[11px] text-white/40 font-mono mt-1 block">
                        Exemplo: https://www.instagram.com/reel/DE-ABC123/ (parâmetros extras são limpos automaticamente)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Título do Projeto *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Cobertura Aftermovie DJ Set"
                          value={instagramForm.title}
                          onChange={(e) => setInstagramForm({ ...instagramForm, title: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Cliente / Marca (opcional)</label>
                        <input
                          type="text"
                          placeholder="Ex: Festival Sons da Noite"
                          value={instagramForm.client}
                          onChange={(e) => setInstagramForm({ ...instagramForm, client: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Categoria</label>
                        <select
                          value={instagramForm.category}
                          onChange={(e) => setInstagramForm({ ...instagramForm, category: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          {categoryList.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Serviços Realizados</label>
                        <input
                          type="text"
                          placeholder="Ex: Storymaker, Edição Vertical, Color Grading"
                          value={instagramForm.services}
                          onChange={(e) => setInstagramForm({ ...instagramForm, services: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1">Descrição Curta (opcional)</label>
                      <textarea
                        rows={2}
                        placeholder="Contexto do Reel, bastidores ou proposta de comunicação..."
                        value={instagramForm.description}
                        onChange={(e) => setInstagramForm({ ...instagramForm, description: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1">Thumbnail Poster (URL opcional)</label>
                      <input
                        type="text"
                        placeholder="Deixe em branco para usar a identidade visual oficial H7.VOX"
                        value={instagramForm.thumbnail}
                        onChange={(e) => setInstagramForm({ ...instagramForm, thumbnail: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                        <input
                          type="checkbox"
                          checked={instagramForm.featured}
                          onChange={(e) => setInstagramForm({ ...instagramForm, featured: e.target.checked })}
                          className="accent-[#08CC07] w-4 h-4"
                        />
                        <span>Destacar na Seção "Meu trabalho em movimento"</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                        <input
                          type="checkbox"
                          checked={instagramForm.published}
                          onChange={(e) => setInstagramForm({ ...instagramForm, published: e.target.checked })}
                          className="accent-[#08CC07] w-4 h-4"
                        />
                        <span>Publicar Imediatamente</span>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                      <button
                        type="submit"
                        disabled={instagramValidating}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>{instagramValidating ? 'Validando link...' : 'Salvar Reel no Portfólio'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: LIXEIRA (SISTEMA DE LIXEIRA REVERSÍVEL) */}
              {activeTab === 'lixeira' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <span>Lixeira de Projetos ({trashProjects.length})</span>
                      </h3>
                      <p className="text-xs text-white/50">
                        Projetos excluídos deixam de ser exibidos no portfólio público, mas ficam salvos aqui para restauração segura.
                      </p>
                    </div>

                    {trashProjects.length > 0 && (
                      <button
                        onClick={() => setShowEmptyTrashConfirm(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Esvaziar Lixeira</span>
                      </button>
                    )}
                  </div>

                  {isLoadingTrash ? (
                    <div className="py-12 text-center text-xs text-white/40 font-mono">
                      Carregando lixeira...
                    </div>
                  ) : trashProjects.length === 0 ? (
                    <div className="py-16 text-center rounded-2xl bg-[#141414] border border-white/5 max-w-md mx-auto space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-[#08CC07] mx-auto opacity-70" />
                      <h4 className="text-sm font-bold text-white">A lixeira está vazia</h4>
                      <p className="text-xs text-white/40">
                        Nenhum projeto excluído no momento.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#141414]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#1c1c1c] text-white/50 font-mono uppercase tracking-wider border-b border-white/10">
                          <tr>
                            <th className="p-3.5">Projeto</th>
                            <th className="p-3.5">Categoria</th>
                            <th className="p-3.5">Data de Exclusão</th>
                            <th className="p-3.5 text-right">Ações de Recuperação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {trashProjects.map((tp) => (
                            <tr key={tp.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3.5">
                                <span className="font-bold text-white block">{tp.title}</span>
                                <span className="text-white/40 font-mono text-[11px]">{tp.client || 'H7.VOX'} · {tp.year}</span>
                              </td>
                              <td className="p-3.5 font-mono text-white/70">{tp.category}</td>
                              <td className="p-3.5 font-mono text-white/50 text-[11px]">
                                {tp.deletedAt ? new Date(tp.deletedAt).toLocaleString('pt-BR') : 'Data não registrada'}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleRestoreProject(tp)}
                                    className="px-3 py-1.5 rounded-lg bg-[#08CC07]/15 hover:bg-[#08CC07]/25 text-[#08CC07] text-xs font-bold border border-[#08CC07]/30 flex items-center gap-1 transition-colors"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Restaurar</span>
                                  </button>

                                  <button
                                    onClick={() => setPermanentDeleteProject(tp)}
                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 flex items-center gap-1 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Excluir Definitivo</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CATEGORIAS */}
              {activeTab === 'categorias' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      Categorias do Portfólio
                    </h3>
                    <p className="text-xs text-white/50">
                      Adicione e organize as categorias de projetos e filtros do seu catálogo.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nome da nova categoria (ex: Moda & Editorial)..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 rounded-lg bg-[#08CC07] text-[#080808] font-bold text-xs"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="space-y-2">
                    {categoryList.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-white font-mono">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cat.active}
                              onChange={(e) => handleToggleCategory(cat.id, e.target.checked)}
                              className="accent-[#08CC07]"
                            />
                            <span>Ativa no filtro</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: MARCAS & CLIENTES COM VERIFICAÇÃO DE VÍNCULO */}
              {activeTab === 'marcas' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">
                        Clientes & Marcas Atendidas ({brands.length})
                      </h3>
                      <p className="text-xs text-white/50">
                        Gerencie as marcas parceiras. A exclusão verifica automaticamente projetos vinculados para evitar dados quebrados.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingBrand({
                          name: '',
                          logo: '',
                          logoUrl: '',
                          description: '',
                          order: brands.length + 1,
                          active: true,
                        });
                        setIsBrandFormOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#08CC07] text-[#080808] hover:bg-[#0ae309] font-bold text-xs transition-colors cursor-pointer"
                    >
                      + Nova Marca
                    </button>
                  </div>

                  {isBrandFormOpen && editingBrand && (
                    <div className="p-5 rounded-2xl bg-[#161616] border border-[#08CC07]/40 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="text-sm font-bold text-white font-display">
                          {editingBrand.id ? 'Editar Marca' : 'Cadastrar Marca & Logo'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsBrandFormOpen(false);
                            setEditingBrand(null);
                          }}
                          className="text-white/40 hover:text-white text-xs cursor-pointer"
                        >
                          Fechar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                            Nome da Marca *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Red Bull, Festival de Inverno"
                            value={editingBrand.name || ''}
                            onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                            Descrição Curta
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Produtora Cultural, Eventos, Institucional"
                            value={editingBrand.description || ''}
                            onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
                          />
                        </div>
                      </div>

                      <FileUploadBox
                        label="Logo da Marca (PNG transparente, SVG ou JPG)"
                        sublabel="Selecione o arquivo da logo do seu computador ou cole uma URL"
                        currentUrl={editingBrand.logo || editingBrand.logoUrl || ''}
                        onUrlChange={(url) => setEditingBrand({ ...editingBrand, logo: url, logoUrl: url })}
                        aspect="contain"
                        placeholder="Clique para selecionar a logo da marca no seu PC"
                      />

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingBrand.active ?? true}
                            onChange={(e) => setEditingBrand({ ...editingBrand, active: e.target.checked })}
                            className="accent-[#08CC07]"
                          />
                          <span>Exibir no carrossel contínuo (loop)</span>
                        </label>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsBrandFormOpen(false);
                              setEditingBrand(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/60 hover:text-white cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editingBrand.name?.trim()) {
                                showToast('Nome da marca é obrigatório', 'error');
                                return;
                              }
                              await api.saveBrand({
                                ...editingBrand,
                                logo: editingBrand.logo || editingBrand.logoUrl || '',
                                logoUrl: editingBrand.logoUrl || editingBrand.logo || '',
                              });
                              await onRefreshData();
                              setIsBrandFormOpen(false);
                              setEditingBrand(null);
                              showToast('Marca salva com sucesso!');
                            }}
                            className="px-5 py-2 rounded-xl bg-[#08CC07] text-[#080808] hover:bg-[#0ae309] font-bold text-xs cursor-pointer shadow-md"
                          >
                            Salvar Marca
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {brands.length === 0 ? (
                    <div className="py-12 px-6 text-center rounded-2xl bg-[#141414] border border-dashed border-white/10 space-y-2">
                      <p className="text-xs text-white/50">
                        Nenhuma marca cadastrada. Clique em "+ Nova Marca" para adicionar logotipos que rodarão em loop contínuo na página inicial.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {brands.map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 sm:p-4 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {(b.logo || b.logoUrl) ? (
                              <div className="w-14 h-11 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={b.logo || b.logoUrl}
                                  alt={b.name}
                                  className="max-h-8 max-w-[48px] object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[#08CC07] font-mono shrink-0">
                                {b.name.substring(0, 3).toUpperCase()}
                              </div>
                            )}

                            <div className="overflow-hidden">
                              <h4 className="text-sm font-bold text-white truncate">{b.name}</h4>
                              <span className="text-xs text-white/40 block truncate">{b.description || 'Parceiro audiovisual'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <label className="flex items-center gap-1.5 text-xs text-white/60 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={b.active}
                                onChange={async (e) => {
                                  await api.saveBrand({ id: b.id, active: e.target.checked });
                                  await onRefreshData();
                                }}
                                className="accent-[#08CC07]"
                              />
                              <span className="hidden sm:inline">Exibir em loop</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingBrand(b);
                                setIsBrandFormOpen(true);
                              }}
                              className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                              title="Editar Marca & Logo"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleInitiateDeleteBrand(b)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                              title="Excluir Marca"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SERVIÇOS */}
              {activeTab === 'servicos' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      Serviços Audiovisuais
                    </h3>
                    <p className="text-xs text-white/50">
                      Edite entregas, títulos e mensagens de WhatsApp de cada serviço.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {services.map((srv, index) => (
                      <div key={srv.id} className="p-5 rounded-xl bg-[#141414] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#08CC07] font-bold">
                            SERVIÇO {srv.code} · {srv.title}
                          </span>
                          <label className="flex items-center gap-1.5 text-xs text-white/60">
                            <input
                              type="checkbox"
                              checked={srv.active}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[index].active = e.target.checked;
                                api.updateServices(updated).then(() => onRefreshData());
                              }}
                              className="accent-[#08CC07]"
                            />
                            <span>Ativo</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={srv.title}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[index].title = e.target.value;
                              api.updateServices(updated).then(() => onRefreshData());
                            }}
                            className="bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={srv.whatsappMessage}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[index].whatsappMessage = e.target.value;
                              api.updateServices(updated).then(() => onRefreshData());
                            }}
                            className="bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={srv.description}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[index].description = e.target.value;
                          }}
                          className="w-full bg-[#1c1c1c] border border-white/10 rounded px-3 py-1.5 text-xs text-white resize-none"
                        />
                      </div>
                    ))}
                    <button
                      onClick={async () => {
                        await api.updateServices(services);
                        await onRefreshData();
                        showToast('Serviços atualizados!');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: BASTIDORES */}
              {activeTab === 'bastidores' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white font-display">
                          Mural de Bastidores & Making Of
                        </h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#08CC07]/10 text-[#08CC07] border border-[#08CC07]/20">
                          {backstage.length} {backstage.length === 1 ? 'item' : 'itens'}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">
                        Fotografias e vídeos do seu processo de captação, direção, iluminação e making of.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {backstage.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowClearAllBackstageConfirm(true)}
                          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Apagar Todos ({backstage.length})</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingBackstage({
                            title: '',
                            mediaType: 'image',
                            mediaUrl: '',
                            caption: '',
                            tag: 'Captação',
                            order: backstage.length + 1,
                            published: true,
                          });
                          setIsBackstageFormOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#08CC07] text-[#080808] hover:bg-[#0ae309] font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#08CC07]/20 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Bastidor</span>
                      </button>
                    </div>
                  </div>

                  {backstage.length === 0 ? (
                    <div className="py-16 px-6 text-center rounded-2xl bg-[#141414] border border-dashed border-white/10 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Nenhum item em bastidores</h4>
                      <p className="text-xs text-white/50 max-w-md mx-auto">
                        Você apagou todos os registros ou ainda não cadastrou nenhum. A seção Bastidores no site ficará recolhida até que você adicione novos itens.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBackstage({
                            title: '',
                            mediaType: 'image',
                            mediaUrl: '',
                            caption: '',
                            tag: 'Captação',
                            order: 1,
                            published: true,
                          });
                          setIsBackstageFormOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08CC07] text-black font-bold text-xs hover:bg-[#0ae309] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Primeiro Bastidor</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {backstage.map((b) => (
                        <div key={b.id} className="p-3.5 rounded-xl bg-[#141414] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group">
                          <div>
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-2.5 relative">
                              <img src={b.mediaUrl} alt={b.title} className="w-full h-full object-cover" />
                              <span className="absolute top-2 left-2 text-[10px] font-mono text-[#08CC07] uppercase bg-black/80 px-2 py-0.5 rounded border border-[#08CC07]/30">
                                {b.tag}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-white line-clamp-1">{b.title}</h5>
                            {b.caption && <p className="text-[11px] text-white/50 mt-1 line-clamp-2">{b.caption}</p>}
                          </div>

                          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/40">
                              Ordem: {b.order}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                title="Editar bastidor"
                                onClick={() => {
                                  setEditingBackstage(b);
                                  setIsBackstageFormOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Excluir bastidor"
                                onClick={() => setBackstageToDelete(b)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: DEPOIMENTOS */}
              {activeTab === 'depoimentos' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white font-display">
                          Depoimentos de Clientes & Produtoras
                        </h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#08CC07]/10 text-[#08CC07] border border-[#08CC07]/20">
                          {testimonials.length} {testimonials.length === 1 ? 'depoimento' : 'depoimentos'}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">
                        Adicione avaliações reais de clientes satisfeitos para exibir credibilidade no site.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial({
                          name: '',
                          role: '',
                          company: '',
                          text: '',
                          avatar: '',
                          rating: 5,
                          projectTitle: '',
                          published: true,
                        });
                        setIsTestimonialFormOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#08CC07] text-[#080808] hover:bg-[#0ae309] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#08CC07]/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Depoimento</span>
                    </button>
                  </div>

                  {testimonials.length === 0 ? (
                    <div className="py-16 px-6 text-center rounded-2xl bg-[#141414] border border-dashed border-white/10 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Nenhum depoimento cadastrado</h4>
                      <p className="text-xs text-white/50 max-w-md mx-auto">
                        Adicione depoimentos de noivos, empresas, diretores ou agências que contrataram seus serviços. A seção no site só aparece quando houver depoimentos cadastrados.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonial({
                            name: '',
                            role: '',
                            company: '',
                            text: '',
                            avatar: '',
                            rating: 5,
                            projectTitle: '',
                            published: true,
                          });
                          setIsTestimonialFormOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08CC07] text-black font-bold text-xs hover:bg-[#0ae309] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Primeiro Depoimento</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map((t) => (
                        <div
                          key={t.id}
                          className="p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {t.avatar ? (
                                  <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-11 h-11 rounded-full object-cover border border-[#08CC07]/30"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-xs font-bold font-mono text-[#08CC07]">
                                    {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                                  <span className="text-xs text-white/50 font-mono">
                                    {t.role || 'Cliente'} {t.company ? `· ${t.company}` : ''}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                {t.published !== false ? (
                                  <span className="text-[10px] font-mono text-[#08CC07] bg-[#08CC07]/10 px-2 py-0.5 rounded border border-[#08CC07]/20">
                                    Ativo
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                    Oculto
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-white/75 italic bg-[#1a1a1a]/60 p-3 rounded-xl border border-white/5 leading-relaxed">
                              "{t.text}"
                            </p>

                            {t.projectTitle && (
                              <div className="text-[11px] font-mono text-[#08CC07]/90 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#08CC07]"></span>
                                <span>Projeto: {t.projectTitle}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <span className="text-[11px] font-mono text-white/40">
                              ★ {t.rating || 5}/5
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                title="Editar depoimento"
                                onClick={() => {
                                  setEditingTestimonial(t);
                                  setIsTestimonialFormOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Excluir depoimento"
                                onClick={() => setTestimonialToDelete(t)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: BRIEFINGS RECEBIDOS */}
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">
                        Briefings Recebidos ({leads.length})
                      </h3>
                      <p className="text-xs text-white/50">
                        Mensagens enviadas pelo formulário do site pelos clientes.
                      </p>
                    </div>
                    <button
                      onClick={loadLeads}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white"
                    >
                      Atualizar
                    </button>
                  </div>

                  {leads.length === 0 ? (
                    <div className="py-12 text-center text-white/40 text-xs bg-[#141414] rounded-xl border border-white/5">
                      Nenhum briefing recebido ainda.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div key={lead.id} className="p-5 rounded-xl bg-[#141414] border border-white/10 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <div>
                              <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                              <span className="text-xs text-white/40 font-mono">
                                {lead.companyOrProject ? `${lead.companyOrProject} · ` : ''}
                                {new Date(lead.createdAt).toLocaleString('pt-BR')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-[#08CC07] bg-[#08CC07]/10 px-2.5 py-1 rounded border border-[#08CC07]/20">
                                {lead.service}
                              </span>
                              <select
                                value={lead.status}
                                onChange={async (e) => {
                                  await api.updateLeadStatus(lead.id, e.target.value as any);
                                  await loadLeads();
                                  showToast('Status atualizado!');
                                }}
                                className="bg-[#1c1c1c] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
                              >
                                <option value="novo">Novo</option>
                                <option value="em_contato">Em Contato</option>
                                <option value="fechado">Fechado</option>
                              </select>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-white/80 whitespace-pre-line leading-relaxed">
                            {lead.description}
                          </p>

                          {lead.estimatedDate && (
                            <div className="text-xs text-white/50 font-mono">
                              Data prevista: <span className="text-white/80">{lead.estimatedDate}</span>
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={async () => {
                                await api.deleteLead(lead.id);
                                await loadLeads();
                                showToast('Lead removido.');
                              }}
                              className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CONFIGURAÇÕES DO SITE */}
              {activeTab === 'configuracoes' && (
                <div className="space-y-8 max-w-3xl">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      Configurações Oficiais da H7.VOX
                    </h3>
                    <p className="text-xs text-white/50">
                      Centralize WhatsApp, Instagram, identidade visual e senha de acesso.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    {/* Contacts */}
                    <div className="p-5 rounded-xl bg-[#141414] border border-white/10 space-y-4">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#08CC07]">
                        Contatos Oficiais & Redes
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">
                            WhatsApp Oficial (81985476681)
                          </label>
                          <input
                            type="text"
                            value={settingsForm.whatsappNumber}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                            placeholder="5581985476681"
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">
                            URL do Instagram Oficial
                          </label>
                          <input
                            type="url"
                            value={settingsForm.instagramUrl}
                            onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                            placeholder="https://www.instagram.com/h7.vox/"
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-white/60 mb-1">
                          Mensagem Inicial Padrão no WhatsApp
                        </label>
                        <input
                          type="text"
                          value={settingsForm.defaultWhatsappMessage}
                          onChange={(e) => setSettingsForm({ ...settingsForm, defaultWhatsappMessage: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Branding Images */}
                    <div className="p-5 rounded-xl bg-[#141414] border border-white/10 space-y-4">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#08CC07]">
                        Logo Oficial H7.VOX
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-black border border-white/10 flex items-center justify-center p-2">
                          <img src="/assets/logo_web.png" alt="H7.VOX" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-xs text-white/60 font-mono space-y-1">
                          <div>Arquivo original: <code className="text-[#08CC07]">public/assets/aistudio/minha_logo_7050a17d.png</code></div>
                          <div>Versão otimizada web: <code className="text-[#08CC07]">/assets/logo_web.png</code></div>
                          <div>Favicon e ícone: <code className="text-[#08CC07]">/assets/logo_icon.png</code></div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-3 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs sm:text-sm hover:bg-[#0ae309] disabled:opacity-50"
                    >
                      {isSavingSettings ? 'Salvando...' : 'Salvar Todas as Configurações'}
                    </button>
                  </form>

                  {/* Password Change */}
                  <div className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-3 pt-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/70">
                      Alterar Senha do Painel
                    </h4>
                    {passFeedback && (
                      <p className="text-xs text-[#08CC07] font-mono">{passFeedback}</p>
                    )}
                    <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="password"
                        required
                        placeholder="Senha atual..."
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        className="bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="password"
                        required
                        placeholder="Nova senha..."
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                      >
                        Atualizar Senha
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB: SIMULADOR & BASE INTERNA DE PREÇOS */}
              {activeTab === 'simulador' && (
                <div className="space-y-8 max-w-4xl">
                  {/* Header */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08CC07]/10 border border-[#08CC07]/20 text-[#08CC07] text-xs font-mono uppercase tracking-wider mb-2">
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Motor de Cálculo H7.VOX</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                      Base Interna de Preços & Regras do Simulador
                    </h3>
                    <p className="text-xs sm:text-sm text-white/50 mt-1">
                      Os preços cadastrados aqui funcionam exclusivamente como base interna para os cálculos e fórmulas do simulador interativo. Nenhuma tabela pública de preços é exibida aos visitantes.
                    </p>
                  </div>

                  {!simulatorConfig ? (
                    <div className="p-8 text-center text-white/50 font-mono text-xs">
                      Carregando regras do simulador...
                    </div>
                  ) : (
                    <form onSubmit={handleSaveSimulator} className="space-y-8">
                      {/* 1. PACOTES DE CONTEÚDO */}
                      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#08CC07]">
                              1. Pacotes de Conteúdo
                            </h4>
                            <p className="text-xs text-white/50">
                              Pacotes fechados com desconto embutido. Ao selecionar o pacote, o sistema não cobra novamente os itens inclusos.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newPkg: any = {
                                id: 'pkg-' + Date.now(),
                                name: 'Novo Pacote',
                                videoCount: 1,
                                cardCount: 1,
                                price: 150,
                                description: '',
                                active: true,
                              };
                              setSimulatorConfig({
                                ...simulatorConfig,
                                packages: [...simulatorConfig.packages, newPkg]
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#08CC07]" />
                            <span>Adicionar Pacote</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {simulatorConfig.packages.map((pkg, idx) => (
                            <div
                              key={pkg.id}
                              className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                            >
                              <div className="sm:col-span-5">
                                <label className="block text-[10px] font-mono text-white/40 mb-1">Nome do Pacote</label>
                                <input
                                  type="text"
                                  value={pkg.name}
                                  onChange={(e) => {
                                    const next = [...simulatorConfig.packages];
                                    next[idx].name = e.target.value;
                                    setSimulatorConfig({ ...simulatorConfig, packages: next });
                                  }}
                                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-medium"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-mono text-white/40 mb-1">Vídeos</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={pkg.videoCount}
                                  onChange={(e) => {
                                    const next = [...simulatorConfig.packages];
                                    next[idx].videoCount = Number(e.target.value);
                                    setSimulatorConfig({ ...simulatorConfig, packages: next });
                                  }}
                                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono text-center"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-mono text-white/40 mb-1">Cards</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={pkg.cardCount}
                                  onChange={(e) => {
                                    const next = [...simulatorConfig.packages];
                                    next[idx].cardCount = Number(e.target.value);
                                    setSimulatorConfig({ ...simulatorConfig, packages: next });
                                  }}
                                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono text-center"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-mono text-white/40 mb-1">Preço (R$)</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="5"
                                  value={pkg.price}
                                  onChange={(e) => {
                                    const next = [...simulatorConfig.packages];
                                    next[idx].price = Number(e.target.value);
                                    setSimulatorConfig({ ...simulatorConfig, packages: next });
                                  }}
                                  className="w-full bg-[#121212] border border-[#08CC07]/40 rounded-lg px-3 py-2 text-xs text-[#08CC07] font-mono font-bold text-center"
                                />
                              </div>

                              <div className="sm:col-span-1 flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  title="Remover pacote"
                                  onClick={() => {
                                    const next = simulatorConfig.packages.filter((_, i) => i !== idx);
                                    setSimulatorConfig({ ...simulatorConfig, packages: next });
                                  }}
                                  className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. SERVIÇOS AVULSOS */}
                      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#08CC07]">
                            2. Tabela de Serviços Avulsos
                          </h4>
                          <p className="text-xs text-white/50">
                            Valores aplicados para itens selecionados avulsamente ou como adicionais além do pacote contratado.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">
                              Card Estático para Redes
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">R$</span>
                              <input
                                type="number"
                                min="0"
                                value={simulatorConfig.standalonePrices.cardPrice}
                                onChange={(e) => {
                                  setSimulatorConfig({
                                    ...simulatorConfig,
                                    standalonePrices: {
                                      ...simulatorConfig.standalonePrices,
                                      cardPrice: Number(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#08CC07] font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">Padrão: R$ 25,00</span>
                          </div>

                          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">
                              Carrossel para Redes
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">R$</span>
                              <input
                                type="number"
                                min="0"
                                value={simulatorConfig.standalonePrices.carouselPrice}
                                onChange={(e) => {
                                  setSimulatorConfig({
                                    ...simulatorConfig,
                                    standalonePrices: {
                                      ...simulatorConfig.standalonePrices,
                                      carouselPrice: Number(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#08CC07] font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">Padrão: R$ 40,00</span>
                          </div>

                          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">
                              Vídeo Avulso
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">R$</span>
                              <input
                                type="number"
                                min="0"
                                value={simulatorConfig.standalonePrices.videoPrice}
                                onChange={(e) => {
                                  setSimulatorConfig({
                                    ...simulatorConfig,
                                    standalonePrices: {
                                      ...simulatorConfig.standalonePrices,
                                      videoPrice: Number(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#08CC07] font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">Padrão: R$ 100,00</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. COBERTURA DE EVENTOS */}
                      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#08CC07]">
                            3. Cobertura de Eventos & Fotos
                          </h4>
                          <p className="text-xs text-white/50">
                            Regras de precificação para fotografias e entregáveis de eventos presenciais.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">
                              Pacote 5 Fotos
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">R$</span>
                              <input
                                type="number"
                                min="0"
                                value={simulatorConfig.eventPrices.photo5Price}
                                onChange={(e) => {
                                  setSimulatorConfig({
                                    ...simulatorConfig,
                                    eventPrices: {
                                      ...simulatorConfig.eventPrices,
                                      photo5Price: Number(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#08CC07] font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">Padrão: R$ 20,00</span>
                          </div>

                          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">
                              Pacote 10 Fotos
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">R$</span>
                              <input
                                type="number"
                                min="0"
                                value={simulatorConfig.eventPrices.photo10Price}
                                onChange={(e) => {
                                  setSimulatorConfig({
                                    ...simulatorConfig,
                                    eventPrices: {
                                      ...simulatorConfig.eventPrices,
                                      photo10Price: Number(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#08CC07] font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">Padrão: R$ 40,00</span>
                          </div>

                          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">
                              Vídeo Individual
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">R$</span>
                              <input
                                type="number"
                                min="0"
                                value={simulatorConfig.eventPrices.singleVideoPrice}
                                onChange={(e) => {
                                  setSimulatorConfig({
                                    ...simulatorConfig,
                                    eventPrices: {
                                      ...simulatorConfig.eventPrices,
                                      singleVideoPrice: Number(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#08CC07] font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">Padrão: R$ 120,00</span>
                          </div>

                          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                            <label className="block text-[11px] font-mono text-white/70 mb-1">
                              Vídeo Coletivo
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">R$</span>
                              <input
                                type="number"
                                min="0"
                                value={simulatorConfig.eventPrices.collectiveVideoPrice}
                                onChange={(e) => {
                                  setSimulatorConfig({
                                    ...simulatorConfig,
                                    eventPrices: {
                                      ...simulatorConfig.eventPrices,
                                      collectiveVideoPrice: Number(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-[#08CC07] font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">Padrão: R$ 150,00</span>
                          </div>
                        </div>
                      </div>

                      {/* 4. REGRAS E OBSERVAÇÕES DE CÁLCULO */}
                      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#08CC07]">
                          4. Regras & Fórmulas Personalizadas
                        </h4>
                        <p className="text-xs text-white/50">
                          Orientações internas de precificação e cálculo para referência da equipe:
                        </p>
                        <textarea
                          rows={3}
                          value={simulatorConfig.formulaNotes || ''}
                          onChange={(e) => {
                            setSimulatorConfig({ ...simulatorConfig, formulaNotes: e.target.value });
                          }}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 font-mono"
                          placeholder="Digite anotações ou regras específicas sobre suas fórmulas de cálculo..."
                        />
                      </div>

                      {/* Save Button */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-white/40 font-mono">
                          As atualizações entram em vigor imediatamente no simulador do site.
                        </span>
                        <button
                          type="submit"
                          disabled={isSavingSimulator}
                          className="px-6 py-3 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs sm:text-sm hover:bg-[#0ae309] transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isSavingSimulator ? 'Salvando...' : 'Salvar Regras do Simulador'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* 5. SIMULAÇÕES RECEBIDAS DOS CLIENTES */}
                  <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 mt-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#08CC07]">
                          Orçamentos Montados pelos Visitantes ({simulations.length})
                        </h4>
                        <p className="text-xs text-white/50">
                          Histórico de simulações geradas com opções escolhidas e contato dos clientes.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={loadSimulatorData}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-mono flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Atualizar</span>
                      </button>
                    </div>

                    {simulations.length === 0 ? (
                      <div className="p-8 text-center text-white/40 text-xs font-mono bg-black/40 rounded-xl border border-white/5">
                        Nenhum orçamento simulado ainda. Quando os visitantes usarem o simulador e enviarem a proposta, ela aparecerá aqui.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {simulations.map((sim) => {
                          const clientWhatsApp = buildWhatsAppLink(
                            settings.whatsappNumber,
                            `Olá ${sim.clientName}! Vi o orçamento que você montou no site H7.VOX para ${sim.categories.join(', ')} e gostaria de dar sequência ao seu projeto.`
                          );

                          return (
                            <div
                              key={sim.id}
                              className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-white">{sim.clientName}</span>
                                  {sim.companyName && (
                                    <span className="text-xs text-white/50 font-mono">({sim.companyName})</span>
                                  )}
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                    sim.status === 'estimado'
                                      ? 'bg-[#08CC07]/20 text-[#08CC07]'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}>
                                    {sim.status === 'estimado' ? 'Estimado' : 'Sob Avaliação'}
                                  </span>
                                </div>

                                <div className="text-xs text-white/70">
                                  <strong>Categorias:</strong> {sim.categories.join(', ')}
                                  {sim.packageSelected && ` • Pacote: ${sim.packageSelected}`}
                                </div>

                                <div className="text-[11px] text-white/40 font-mono flex items-center gap-3">
                                  <span>{new Date(sim.createdAt).toLocaleDateString('pt-BR')} às {new Date(sim.createdAt).toLocaleTimeString('pt-BR')}</span>
                                  {sim.city && <span>Local: {sim.city}</span>}
                                  {sim.instagram && <span>IG: {sim.instagram}</span>}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                  <span className="text-[10px] text-white/40 block font-mono">Total</span>
                                  <span className="text-base font-mono font-bold text-[#08CC07]">
                                    {sim.estimatedTotal !== null
                                      ? `R$ ${sim.estimatedTotal.toFixed(2).replace('.', ',')}`
                                      : 'Sob Avaliação'}
                                  </span>
                                </div>

                                <a
                                  href={clientWhatsApp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 rounded-lg bg-[#08CC07]/20 hover:bg-[#08CC07]/30 text-[#08CC07] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Conversar</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSimulation(sim.id)}
                                  className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  title="Remover registro"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Confirmação de Exclusão de Projeto */}
      {projectToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#161616] rounded-2xl border border-red-500/40 p-6 sm:p-7 space-y-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                  Confirmar Exclusão de Projeto
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Esta ação removerá a publicação do portfólio oficial H7.VOX.
                </p>
              </div>
            </div>

            {/* Project Preview Card */}
            <div className="p-3.5 rounded-xl bg-[#0e0e0e] border border-white/10 flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                <img
                  src={projectToDelete.thumbnail || '/assets/logo_web.png'}
                  alt={projectToDelete.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {projectToDelete.title}
                </h4>
                <div className="text-xs text-white/50 flex items-center gap-2 mt-1">
                  <span>{projectToDelete.client || 'H7.VOX'}</span>
                  <span>·</span>
                  <span className="font-mono text-[#08CC07]">{projectToDelete.category}</span>
                  <span>·</span>
                  <span>{projectToDelete.year}</span>
                </div>
              </div>
            </div>

            {/* Warning Callout */}
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-red-400 font-bold block mb-1 text-sm">
                  Atenção: Esta ação é definitiva e removerá o projeto do banco de dados e do portfólio.
                </strong>
                <span className="text-white/80">
                  O projeto <strong className="text-white font-semibold">"{projectToDelete.title}"</strong> será permanentemente excluído. Esta ação não poderá ser desfeita.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={() => setProjectToDelete(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeletingProject}
                onClick={handleConfirmDeleteProject}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isDeletingProject ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmar Exclusão</span>
                  </>
                )}
              </button>
            </div>

            {/* Alternative Soft Delete Link */}
            <div className="text-center pt-2 border-t border-white/5">
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={handleConfirmMoveToTrash}
                className="text-[11px] text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
              >
                Prefere apenas mover temporariamente para a lixeira?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirmação de Exclusão Definitiva */}
      {permanentDeleteProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181111] rounded-2xl border border-red-500/30 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-display">
              Excluir definitivamente?
            </h3>

            <p className="text-xs text-red-200/80 leading-relaxed">
              ATENÇÃO: Você está prestes a apagar permanentemente o projeto <strong className="text-white">"{permanentDeleteProject.title}"</strong> do banco de dados. Essa operação é irreversível e não poderá ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={isPermanentDeleting}
                onClick={() => setPermanentDeleteProject(null)}
                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isPermanentDeleting}
                onClick={handleConfirmPermanentDelete}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50"
              >
                {isPermanentDeleting ? 'Apagando definitivo...' : 'Excluir Definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Esvaziar Lixeira */}
      {showEmptyTrashConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181111] rounded-2xl border border-red-500/30 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Esvaziar toda a lixeira?</h3>
            <p className="text-xs text-white/70">
              Isso apagará definitivamente todos os {trashProjects.length} projeto(s) da lixeira.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEmptyTrashConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white/5 text-xs text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleEmptyTrash}
                disabled={isEmptyingTrash}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50"
              >
                {isEmptyingTrash ? 'Esvaziando...' : 'Sim, Esvaziar Lixeira'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Verificação de Vínculo de Marca */}
      {brandUsageData && brandToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161616] rounded-2xl border border-yellow-500/30 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-display">
              Marca vinculada a projetos do portfólio
            </h3>

            <p className="text-xs text-white/80 leading-relaxed">
              Esta marca <strong className="text-yellow-400">"{brandToDelete.name}"</strong> está vinculada a {brandUsageData.projectCount} projeto(s):
            </p>

            <div className="p-3 rounded-lg bg-black/50 border border-white/5 max-h-32 overflow-y-auto space-y-1">
              {brandUsageData.projectTitles.map((title, idx) => (
                <div key={idx} className="text-xs text-white/70 flex items-center gap-1.5">
                  <Film className="w-3 h-3 text-[#08CC07] shrink-0" />
                  <span className="truncate">{title}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed">
              Escolha como deseja prosseguir sem quebrar dados:
            </p>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                type="button"
                disabled={isProcessingBrandDelete}
                onClick={() => handleResolveBrandDelete('hide')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-left flex items-center justify-between"
              >
                <span>Apenas Ocultar Marca (preserva vínculos)</span>
                <EyeOff className="w-3.5 h-3.5 text-white/50" />
              </button>

              <button
                type="button"
                disabled={isProcessingBrandDelete}
                onClick={() => handleResolveBrandDelete('unlink-and-delete')}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs text-left flex items-center justify-between"
              >
                <span>Remover Vínculo dos Projetos e Excluir Marca</span>
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={isProcessingBrandDelete}
                onClick={() => {
                  setBrandUsageData(null);
                  setBrandToDelete(null);
                }}
                className="w-full py-2 px-4 rounded-xl bg-white/5 text-white/60 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmação de Exclusão de Bastidor */}
      {backstageToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181111] rounded-2xl border border-red-500/30 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-display">
              Excluir item de bastidor?
            </h3>

            <p className="text-xs text-white/70 leading-relaxed">
              Você tem certeza que deseja apagar o registro <strong className="text-white">"{backstageToDelete.title}"</strong>? Ele deixará de aparecer no mural de Bastidores do site imediatamente.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                disabled={isDeletingBackstage}
                onClick={() => setBackstageToDelete(null)}
                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeletingBackstage}
                onClick={handleConfirmDeleteBackstage}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDeletingBackstage ? 'Apagando...' : 'Sim, Excluir Bastidor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmação de Limpar Todos os Bastidores */}
      {showClearAllBackstageConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181111] rounded-2xl border border-red-500/40 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-display">
              Apagar todos os {backstage.length} bastidores?
            </h3>

            <p className="text-xs text-red-200/80 leading-relaxed">
              ATENÇÃO: Todos os registros de bastidores e making of serão removidos permanentemente. A seção Bastidores ficará oculta no site até que novos itens sejam adicionados.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                disabled={isClearingBackstage}
                onClick={() => setShowClearAllBackstageConfirm(false)}
                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isClearingBackstage}
                onClick={handleConfirmClearAllBackstage}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                {isClearingBackstage ? 'Apagando tudo...' : 'Sim, Apagar Todos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Criar / Editar Item de Bastidor */}
      {isBackstageFormOpen && editingBackstage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#141414] rounded-2xl border border-white/15 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {editingBackstage.id ? 'Editar Bastidor' : 'Novo Item de Bastidor'}
                </h3>
                <p className="text-xs text-white/50">
                  Fotos e vídeos que mostram sua rotina, equipamentos e captação.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBackstageFormOpen(false);
                  setEditingBackstage(null);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBackstage} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Título do Registro *
                </label>
                <input
                  type="text"
                  required
                  value={editingBackstage.title || ''}
                  onChange={(e) => setEditingBackstage({ ...editingBackstage, title: e.target.value })}
                  placeholder="Ex: Setup de Câmera e Lente 35mm"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Tag / Categoria
                  </label>
                  <select
                    value={editingBackstage.tag || 'Captação'}
                    onChange={(e) => setEditingBackstage({ ...editingBackstage, tag: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#08CC07]"
                  >
                    <option value="Captação">Captação</option>
                    <option value="Pós-Produção">Pós-Produção</option>
                    <option value="Storymaker">Storymaker</option>
                    <option value="Color Grading">Color Grading</option>
                    <option value="Iluminação">Iluminação</option>
                    <option value="Direção">Direção</option>
                    <option value="Evento">Evento</option>
                    <option value="Bastidores">Bastidores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingBackstage.order || 1}
                    onChange={(e) => setEditingBackstage({ ...editingBackstage, order: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#08CC07]"
                  />
                </div>
              </div>

              <FileUploadBox
                label="Foto ou Vídeo dos Bastidores *"
                sublabel="Selecione a foto diretamente do seu computador ou cole uma URL"
                currentUrl={editingBackstage.mediaUrl || ''}
                onUrlChange={(url) => setEditingBackstage({ ...editingBackstage, mediaUrl: url })}
                aspect="video"
                placeholder="Clique para selecionar foto de bastidores no seu PC"
              />

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Legenda / Detalhes Técnicos (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={editingBackstage.caption || ''}
                  onChange={(e) => setEditingBackstage({ ...editingBackstage, caption: e.target.value })}
                  placeholder="Ex: Montagem do kit de iluminação para gravação de entrevista..."
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={isSavingBackstage}
                  onClick={() => {
                    setIsBackstageFormOpen(false);
                    setEditingBackstage(null);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingBackstage}
                  className="px-6 py-2.5 rounded-lg bg-[#08CC07] text-[#080808] hover:bg-[#0ae309] font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingBackstage ? 'Salvando...' : 'Salvar Bastidor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmação de Exclusão de Depoimento */}
      {testimonialToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#141414] rounded-2xl border border-red-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Excluir Depoimento?
                </h3>
                <p className="text-xs text-white/50">Esta ação não pode ser desfeita.</p>
              </div>
            </div>

            <p className="text-xs text-white/80 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
              Você está prestes a remover o depoimento de <span className="font-bold text-white">"{testimonialToDelete.name}"</span> ({testimonialToDelete.company || testimonialToDelete.role || 'Cliente'}).
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingTestimonial}
                onClick={() => setTestimonialToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeletingTestimonial}
                onClick={handleConfirmDeleteTestimonial}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingTestimonial ? 'Excluindo...' : 'Sim, Excluir'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Criar / Editar Depoimento */}
      {isTestimonialFormOpen && editingTestimonial && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#141414] rounded-2xl border border-white/15 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#08CC07]/15 border border-[#08CC07]/30 flex items-center justify-center text-[#08CC07]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {editingTestimonial.id ? 'Editar Depoimento' : 'Novo Depoimento de Cliente'}
                  </h3>
                  <p className="text-xs text-white/50">
                    Depoimento real com nome, empresa e relato.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsTestimonialFormOpen(false);
                  setEditingTestimonial(null);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    placeholder="Ex: Carlos Mendes"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    placeholder="Ex: Diretor de Marketing"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Empresa / Marca / Projeto
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.company || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                    placeholder="Ex: Agência Pulse"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Avaliação (Estrelas)
                  </label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#08CC07]"
                  >
                    <option value="5">★★★★★ (5 Estrelas - Excelente)</option>
                    <option value="4">★★★★☆ (4 Estrelas - Muito Bom)</option>
                    <option value="3">★★★☆☆ (3 Estrelas - Bom)</option>
                  </select>
                </div>
              </div>

              <FileUploadBox
                label="Foto / Avatar do Cliente"
                sublabel="Selecione a foto diretamente dos arquivos do seu computador (PNG, JPG, WEBP) ou cole um link"
                currentUrl={editingTestimonial.avatar || ''}
                onUrlChange={(url) => setEditingTestimonial({ ...editingTestimonial, avatar: url })}
                aspect="circle"
                placeholder="Clique para selecionar a foto do cliente no seu PC"
              />

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                  Texto do Depoimento *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingTestimonial.text || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  placeholder="Relato do cliente sobre o atendimento, qualidade de captação, agilidade de entrega ou resultado final..."
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={editingTestimonial.published !== false}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, published: e.target.checked })}
                    className="rounded bg-[#1c1c1c] border-white/20 text-[#08CC07] focus:ring-[#08CC07]"
                  />
                  <span>Exibir imediatamente no site</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={isSavingTestimonial}
                  onClick={() => {
                    setIsTestimonialFormOpen(false);
                    setEditingTestimonial(null);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingTestimonial}
                  className="px-6 py-2.5 rounded-lg bg-[#08CC07] text-[#080808] hover:bg-[#0ae309] font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingTestimonial ? 'Salvando...' : 'Salvar Depoimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
