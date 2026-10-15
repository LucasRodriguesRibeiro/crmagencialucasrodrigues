/**
 * Agência Lucas Rodrigues - CRM de Leads
 * Gestão de Leads, Funil Comercial e Controle de Faturamento
 * Persistência JSON e LocalStorage
 */

(function () {
  'use strict';

  // Storage key
  const STORAGE_KEY = 'ALR_CRM_LEADS_DATA_V1';

  // State
  let leads = [];
  let currentFilterStatus = 'ALL';
  let currentSearchQuery = '';
  let currentSort = 'newest';
  let currentView = 'table'; // 'table' or 'pipeline'

  // DOM Elements
  const leadsTableBody = document.getElementById('leadsTableBody');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const filterStatus = document.getElementById('filterStatus');
  const sortLeads = document.getElementById('sortLeads');

  // Views
  const tableViewContainer = document.getElementById('tableViewContainer');
  const pipelineViewContainer = document.getElementById('pipelineViewContainer');
  const btnViewTable = document.getElementById('btnViewTable');
  const btnViewPipeline = document.getElementById('btnViewPipeline');

  // Dashboard Metrics
  const metricTotalLeads = document.getElementById('metricTotalLeads');
  const metricLeadsActiveBadge = document.getElementById('metricLeadsActiveBadge');
  const metricFaturamento = document.getElementById('metricFaturamento');
  const metricConvertedCount = document.getElementById('metricConvertedCount');
  const metricConversionRate = document.getElementById('metricConversionRate');
  const metricTicketMedio = document.getElementById('metricTicketMedio');

  // Funnel Summary
  const funnelSummaryText = document.getElementById('funnelSummaryText');
  const segConversa = document.getElementById('segConversa');
  const segProposta = document.getElementById('segProposta');
  const segConvertido = document.getElementById('segConvertido');
  const segPerdido = document.getElementById('segPerdido');
  const countConversa = document.getElementById('countConversa');
  const countProposta = document.getElementById('countProposta');
  const countConvertido = document.getElementById('countConvertido');
  const countPerdido = document.getElementById('countPerdido');

  // Pipeline Columns
  const pipelineCardsConversa = document.getElementById('pipelineCardsConversa');
  const pipelineCardsProposta = document.getElementById('pipelineCardsProposta');
  const pipelineCardsConvertido = document.getElementById('pipelineCardsConvertido');
  const pipelineCardsPerdido = document.getElementById('pipelineCardsPerdido');
  const colBadgeConversa = document.getElementById('colBadgeConversa');
  const colBadgeProposta = document.getElementById('colBadgeProposta');
  const colBadgeConvertido = document.getElementById('colBadgeConvertido');
  const colBadgePerdido = document.getElementById('colBadgePerdido');
  const colRevenueConvertido = document.getElementById('colRevenueConvertido');

  // Modal: Lead Form
  const leadModal = document.getElementById('leadModal');
  const leadForm = document.getElementById('leadForm');
  const leadModalTitle = document.getElementById('leadModalTitle');
  const btnCloseLeadModal = document.getElementById('btnCloseLeadModal');
  const btnCancelLeadModal = document.getElementById('btnCancelLeadModal');
  const btnOpenNewLeadModal = document.getElementById('btnOpenNewLeadModal');
  const btnEmptyAddLead = document.getElementById('btnEmptyAddLead');

  // Form Inputs
  const leadIdInput = document.getElementById('leadId');
  const leadNameInput = document.getElementById('leadName');
  const leadPhoneInput = document.getElementById('leadPhone');
  const leadServiceInput = document.getElementById('leadService');
  const leadStatusSelect = document.getElementById('leadStatus');
  const leadValueContainer = document.getElementById('leadValueContainer');
  const leadValueInput = document.getElementById('leadValue');
  const leadNotesInput = document.getElementById('leadNotes');

  // Error spans
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const serviceError = document.getElementById('serviceError');
  const valueError = document.getElementById('valueError');

  // Modal: Prompt Conversion Value
  const conversionPromptModal = document.getElementById('conversionPromptModal');
  const promptLeadId = document.getElementById('promptLeadId');
  const promptLeadName = document.getElementById('promptLeadName');
  const promptValueInput = document.getElementById('promptValueInput');
  const promptValueError = document.getElementById('promptValueError');
  const btnConfirmPromptConversion = document.getElementById('btnConfirmPromptConversion');
  const btnCancelPrompt = document.getElementById('btnCancelPrompt');
  const btnClosePromptModal = document.getElementById('btnClosePromptModal');

  // Modal: Lead Details
  const leadDetailsModal = document.getElementById('leadDetailsModal');
  const btnCloseDetailModal = document.getElementById('btnCloseDetailModal');
  const detailLeadName = document.getElementById('detailLeadName');
  const detailLeadDate = document.getElementById('detailLeadDate');
  const detailLeadPhone = document.getElementById('detailLeadPhone');
  const detailWhatsappLink = document.getElementById('detailWhatsappLink');
  const detailLeadService = document.getElementById('detailLeadService');
  const detailLeadStatusBadge = document.getElementById('detailLeadStatusBadge');
  const detailLeadValue = document.getElementById('detailLeadValue');
  const detailLeadNotes = document.getElementById('detailLeadNotes');
  const btnEditFromDetail = document.getElementById('btnEditFromDetail');
  const btnDeleteFromDetail = document.getElementById('btnDeleteFromDetail');
  let currentDetailLeadId = null;

  // JSON Backup / Restore
  const btnExportJson = document.getElementById('btnExportJson');
  const btnImportJsonTrigger = document.getElementById('btnImportJsonTrigger');
  const jsonFileInput = document.getElementById('jsonFileInput');
  const btnSampleData = document.getElementById('btnSampleData');
  const toastContainer = document.getElementById('toastContainer');

  // Initial Sample Leads for First Time Experience
  const INITIAL_SAMPLE_LEADS = [
    {
      id: 'lead_1',
      name: 'Dr. Leonardo Vasconcelos',
      phone: '(11) 99876-5432',
      service: 'Gestão de Tráfego Pago & Google Ads',
      status: 'Lead convertido',
      value: 6500.00,
      notes: 'Contrato fechado trimestral. Campanhas focadas em Direito Tributário e Empresarial.',
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'lead_2',
      name: 'Dra. Beatriz Meneses Advocacia',
      phone: '(21) 98765-4321',
      service: 'Assessoria de Posicionamento e Redes Sociais',
      status: 'Apresentação de proposta',
      value: 3800.00,
      notes: 'Proposta enviada em PDF. Reunião de alinhamento com os sócios marcada para sexta-feira.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'lead_3',
      name: 'Dr. Marcelo Antunes & Associados',
      phone: '(31) 97654-3210',
      service: 'Criação de Site Institucional & Landing Page',
      status: 'Lead convertido',
      value: 5200.00,
      notes: '50% de entrada paga. Desenvolvimento da identidade e wireframe iniciado.',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'lead_4',
      name: 'Dra. Mariana Costa',
      phone: '(41) 99123-4567',
      service: 'Consultoria Estratégica de Captação Ética',
      status: 'Em conversa',
      value: 0,
      notes: 'Lead vindo de indicação. Interessada em expandir atuação em Direito de Família.',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'lead_5',
      name: 'Escritório Alencar & Ramos',
      phone: '(85) 98834-1122',
      service: 'Gestão de Tráfego Pago',
      status: 'Lead perdido',
      value: 0,
      notes: 'Optaram por reestruturar a equipe interna antes de contratar agência parceira.',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];

  /* ==========================================================================
     Formatters & Helpers
     ========================================================================== */

  // Currency Formatter BRL
  function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Parse BRL currency input string to float number
  function parseCurrency(str) {
    if (!str) return 0;
    if (typeof str === 'number') return str;
    // Remove R$, spaces, thousand dots
    const cleaned = str.replace(/[R$\s.]/g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }

  // Format currency while typing in input
  function formatCurrencyInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value === '') {
      input.value = '';
      return;
    }
    const floatVal = (parseFloat(value) / 100).toFixed(2);
    const parts = floatVal.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = parts.join(',');
  }

  // Format Date for Display
  function formatDate(isoString) {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  }

  // Format Brazilian Phone with Mask
  function formatPhoneInput(value) {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }

  // Generate WhatsApp Link
  function getWhatsAppUrl(phone, name) {
    const digits = phone.replace(/\D/g, '');
    const cleanNumber = digits.startsWith('55') ? digits : `55${digits}`;
    const message = encodeURIComponent(`Olá ${name}, tudo bem? Aqui é da Agência Lucas Rodrigues. Estamos entrando em contato para dar continuidade ao seu atendimento.`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  }

  // Toast Notification System
  function showToast(title, message = '', type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        ${message ? `<span class="toast-msg">${message}</span>` : ''}
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  /* ==========================================================================
     Data Management & LocalStorage
     ========================================================================== */

  function loadLeads() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          leads = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do localStorage:', e);
    }
    // If empty, load sample leads so user immediately has a functional experience
    leads = [...INITIAL_SAMPLE_LEADS];
    saveLeads();
  }

  function saveLeads() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
      showToast('Erro de armazenamento', 'Não foi possível salvar localmente.', 'error');
    }
  }

  /* ==========================================================================
     JSON Export / Download & Import / Restore
     ========================================================================== */

  // Save / Export JSON File (Downloads .json)
  function exportJsonBackup() {
    const totalFaturado = leads
      .filter(l => l.status === 'Lead convertido')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    const backupPayload = {
      sistema: 'Agência Lucas Rodrigues CRM',
      versao: '1.0',
      dataExportacao: new Date().toISOString(),
      resumo: {
        totalLeads: leads.length,
        valorFaturado: totalFaturado,
        convertidos: leads.filter(l => l.status === 'Lead convertido').length
      },
      leads: leads
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10);
    const fileName = `crm-agencia-lucas-rodrigues-backup-${dateStamp}.json`;

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Backup JSON Gerado!', `Arquivo "${fileName}" salvo no seu dispositivo.`, 'success');
  }

  // Trigger File Input for Restore
  function triggerImportJson() {
    jsonFileInput.value = '';
    jsonFileInput.click();
  }

  // Handle Uploaded JSON File
  function handleJsonFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        let importedLeads = null;

        // Support both direct array or backup object with `leads` property
        if (Array.isArray(parsed)) {
          importedLeads = parsed;
        } else if (parsed && Array.isArray(parsed.leads)) {
          importedLeads = parsed.leads;
        }

        if (!importedLeads) {
          throw new Error('Estrutura de arquivo inválida. Não foi encontrada a lista de leads.');
        }

        // Validate and sanitize leads
        const sanitized = importedLeads.map((item, index) => ({
          id: item.id || `lead_${Date.now()}_${index}`,
          name: item.name || 'Lead sem nome',
          phone: item.phone || '(00) 00000-0000',
          service: item.service || 'Serviço Geral',
          status: ['Em conversa', 'Apresentação de proposta', 'Lead convertido', 'Lead perdido'].includes(item.status)
            ? item.status
            : 'Em conversa',
          value: Number(item.value) || 0,
          notes: item.notes || '',
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        }));

        leads = sanitized;
        saveLeads();
        renderAll();
        showToast('Restauração Concluída!', `${leads.length} leads foram restaurados com sucesso do JSON.`, 'success');
      } catch (err) {
        console.error('Falha ao restaurar JSON:', err);
        showToast('Erro ao importar JSON', 'O arquivo selecionado não contém um formato JSON válido do CRM.', 'error');
      }
    };

    reader.readAsText(file);
  }

  /* ==========================================================================
     Dashboard Calculations & Rendering
     ========================================================================== */

  function updateDashboard() {
    const total = leads.length;
    const emConversa = leads.filter(l => l.status === 'Em conversa').length;
    const proposta = leads.filter(l => l.status === 'Apresentação de proposta').length;
    const convertidos = leads.filter(l => l.status === 'Lead convertido').length;
    const perdidos = leads.filter(l => l.status === 'Lead perdido').length;
    const emAndamento = emConversa + proposta;

    // Faturamento Total (Valor das vendas dos leads convertidos)
    const faturamento = leads
      .filter(l => l.status === 'Lead convertido')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    // Taxa de Conversão (%)
    const conversionRate = total > 0 ? ((convertidos / total) * 100).toFixed(1) : '0';

    // Ticket Médio
    const ticketMedio = convertidos > 0 ? faturamento / convertidos : 0;

    // Update DOM
    metricTotalLeads.textContent = total;
    metricLeadsActiveBadge.textContent = `${emAndamento} em andamento`;
    metricFaturamento.textContent = formatCurrency(faturamento);
    metricConvertedCount.textContent = `${convertidos} lead${convertidos === 1 ? '' : 's'} convertido${convertidos === 1 ? '' : 's'}`;
    metricConversionRate.textContent = `${conversionRate}%`;
    metricTicketMedio.textContent = formatCurrency(ticketMedio);

    // Funnel Stage Numbers
    countConversa.textContent = emConversa;
    countProposta.textContent = proposta;
    countConvertido.textContent = convertidos;
    countPerdido.textContent = perdidos;

    funnelSummaryText.textContent = `${total} lead${total === 1 ? '' : 's'} registrado${total === 1 ? '' : 's'}`;

    // Funnel Progress Bar Segments
    if (total > 0) {
      segConversa.style.width = `${(emConversa / total) * 100}%`;
      segProposta.style.width = `${(proposta / total) * 100}%`;
      segConvertido.style.width = `${(convertidos / total) * 100}%`;
      segPerdido.style.width = `${(perdidos / total) * 100}%`;
    } else {
      segConversa.style.width = '0%';
      segProposta.style.width = '0%';
      segConvertido.style.width = '0%';
      segPerdido.style.width = '0%';
    }

    // Pipeline column badges & column revenue
    colBadgeConversa.textContent = emConversa;
    colBadgeProposta.textContent = proposta;
    colBadgeConvertido.textContent = convertidos;
    colBadgePerdido.textContent = perdidos;
    colRevenueConvertido.textContent = `Faturado: ${formatCurrency(faturamento)}`;
  }

  /* ==========================================================================
     Filtering & Sorting
     ========================================================================== */

  function getFilteredAndSortedLeads() {
    let result = leads.filter(lead => {
      // Status filter
      if (currentFilterStatus !== 'ALL' && lead.status !== currentFilterStatus) {
        return false;
      }
      // Search query filter (matches name, phone, service)
      if (currentSearchQuery.trim() !== '') {
        const q = currentSearchQuery.toLowerCase();
        const matchesName = (lead.name || '').toLowerCase().includes(q);
        const matchesPhone = (lead.phone || '').toLowerCase().includes(q);
        const matchesService = (lead.service || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesService) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (currentSort === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (currentSort === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (currentSort === 'nameAsc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (currentSort === 'valueDesc') {
        return (Number(b.value) || 0) - (Number(a.value) || 0);
      }
      return 0;
    });

    return result;
  }

  /* ==========================================================================
     Status Badge Helper
     ========================================================================== */

  function getStatusBadgeHtml(status) {
    let badgeClass = 'status-conversa';
    if (status === 'Apresentação de proposta') badgeClass = 'status-proposta';
    if (status === 'Lead convertido') badgeClass = 'status-convertido';
    if (status === 'Lead perdido') badgeClass = 'status-perdido';

    return `
      <span class="status-badge ${badgeClass}">
        <span class="badge-dot"></span>
        ${status}
      </span>
    `;
  }

  /* ==========================================================================
     Table View Rendering
     ========================================================================== */

  function renderTable(filteredLeads) {
    leadsTableBody.innerHTML = '';

    if (filteredLeads.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';

    filteredLeads.forEach(lead => {
      const tr = document.createElement('tr');
      tr.dataset.id = lead.id;

      const isConverted = lead.status === 'Lead convertido';
      const formattedValue = isConverted && lead.value > 0 ? formatCurrency(lead.value) : '—';
      const waUrl = getWhatsAppUrl(lead.phone, lead.name);

      tr.innerHTML = `
        <td>
          <div class="lead-info-cell">
            <span class="lead-name-text" data-action="view" title="Clique para ver detalhes">${escapeHtml(lead.name)}</span>
            <span class="lead-date-text">Cadastrado em ${formatDate(lead.createdAt)}</span>
          </div>
        </td>
        <td>
          <div class="phone-cell">
            <span class="phone-number-text">${escapeHtml(lead.phone)}</span>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-icon" title="Conversar no WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
          </div>
        </td>
        <td>
          <span class="service-pill" title="${escapeHtml(lead.service)}">${escapeHtml(lead.service)}</span>
        </td>
        <td>
          <div class="status-select-wrap">
            <select class="status-quick-select" data-id="${lead.id}">
              <option value="Em conversa" ${lead.status === 'Em conversa' ? 'selected' : ''}>Em conversa</option>
              <option value="Apresentação de proposta" ${lead.status === 'Apresentação de proposta' ? 'selected' : ''}>Apresentação de proposta</option>
              <option value="Lead convertido" ${lead.status === 'Lead convertido' ? 'selected' : ''}>Lead convertido 🏆</option>
              <option value="Lead perdido" ${lead.status === 'Lead perdido' ? 'selected' : ''}>Lead perdido</option>
            </select>
          </div>
        </td>
        <td>
          <span class="value-display ${isConverted ? 'has-value' : 'no-value'}">
            ${formattedValue}
          </span>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-action-icon" data-action="view" title="Ver Detalhes">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-action-icon" data-action="edit" title="Editar Lead">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-action-icon btn-delete" data-action="delete" title="Excluir Lead">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      `;

      leadsTableBody.appendChild(tr);
    });
  }

  /* ==========================================================================
     Pipeline / Kanban Board Rendering
     ========================================================================== */

  function renderPipeline(filteredLeads) {
    pipelineCardsConversa.innerHTML = '';
    pipelineCardsProposta.innerHTML = '';
    pipelineCardsConvertido.innerHTML = '';
    pipelineCardsPerdido.innerHTML = '';

    const groups = {
      'Em conversa': pipelineCardsConversa,
      'Apresentação de proposta': pipelineCardsProposta,
      'Lead convertido': pipelineCardsConvertido,
      'Lead perdido': pipelineCardsPerdido
    };

    filteredLeads.forEach(lead => {
      const container = groups[lead.status] || pipelineCardsConversa;
      const card = document.createElement('div');
      card.className = 'pipeline-card';
      card.dataset.id = lead.id;

      const waUrl = getWhatsAppUrl(lead.phone, lead.name);
      const isConverted = lead.status === 'Lead convertido';

      card.innerHTML = `
        <div class="pipeline-card-top">
          <div>
            <div class="pipeline-lead-name">${escapeHtml(lead.name)}</div>
            <div class="pipeline-service-name">${escapeHtml(lead.service)}</div>
          </div>
        </div>
        <div class="pipeline-card-bottom">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="pipeline-phone-link" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px;">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            ${escapeHtml(lead.phone)}
          </a>
          ${isConverted ? `<span class="pipeline-card-value">${formatCurrency(lead.value)}</span>` : ''}
        </div>
      `;

      card.addEventListener('click', () => openLeadDetailsModal(lead.id));
      container.appendChild(card);
    });
  }

  function renderAll() {
    const filtered = getFilteredAndSortedLeads();
    updateDashboard();
    renderTable(filtered);
    renderPipeline(filtered);
  }

  /* ==========================================================================
     Escape HTML Helper
     ========================================================================== */
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     Modal Form Handling (Add / Edit Lead)
     ========================================================================== */

  function openNewLeadModal() {
    leadForm.reset();
    leadIdInput.value = '';
    leadModalTitle.textContent = 'Novo Lead';
    clearErrors();
    leadStatusSelect.value = 'Em conversa';
    leadValueContainer.style.display = 'none';
    leadValueInput.value = '';
    leadModal.classList.add('active');
    leadModal.setAttribute('aria-hidden', 'false');
    leadNameInput.focus();
  }

  function openEditLeadModal(id) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    clearErrors();
    leadIdInput.value = lead.id;
    leadModalTitle.textContent = 'Editar Lead';
    leadNameInput.value = lead.name;
    leadPhoneInput.value = lead.phone;
    leadServiceInput.value = lead.service;
    leadStatusSelect.value = lead.status;
    leadNotesInput.value = lead.notes || '';

    if (lead.status === 'Lead convertido') {
      leadValueContainer.style.display = 'flex';
      const num = Number(lead.value) || 0;
      leadValueInput.value = num > 0 ? num.toFixed(2).replace('.', ',') : '';
    } else {
      leadValueContainer.style.display = 'none';
      leadValueInput.value = '';
    }

    leadModal.classList.add('active');
    leadModal.setAttribute('aria-hidden', 'false');
    leadNameInput.focus();
  }

  function closeLeadModal() {
    leadModal.classList.remove('active');
    leadModal.setAttribute('aria-hidden', 'true');
    clearErrors();
  }

  function clearErrors() {
    nameError.classList.remove('visible');
    phoneError.classList.remove('visible');
    serviceError.classList.remove('visible');
    valueError.classList.remove('visible');
    leadNameInput.classList.remove('has-error');
    leadPhoneInput.classList.remove('has-error');
    leadServiceInput.classList.remove('has-error');
    leadValueInput.classList.remove('has-error');
  }

  // Handle Form Submission
  function handleLeadFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = leadNameInput.value.trim();
    const phone = leadPhoneInput.value.trim();
    const service = leadServiceInput.value.trim();
    const status = leadStatusSelect.value;
    const notes = leadNotesInput.value.trim();
    const id = leadIdInput.value;

    let isValid = true;

    if (!name) {
      nameError.classList.add('visible');
      leadNameInput.classList.add('has-error');
      isValid = false;
    }

    if (!phone || phone.replace(/\D/g, '').length < 8) {
      phoneError.classList.add('visible');
      leadPhoneInput.classList.add('has-error');
      isValid = false;
    }

    if (!service) {
      serviceError.classList.add('visible');
      leadServiceInput.classList.add('has-error');
      isValid = false;
    }

    let value = 0;
    if (status === 'Lead convertido') {
      value = parseCurrency(leadValueInput.value);
      if (value <= 0) {
        valueError.classList.add('visible');
        leadValueInput.classList.add('has-error');
        isValid = false;
      }
    }

    if (!isValid) return;

    if (id) {
      // Edit existing
      const index = leads.findIndex(l => l.id === id);
      if (index !== -1) {
        leads[index] = {
          ...leads[index],
          name,
          phone,
          service,
          status,
          value,
          notes,
          updatedAt: new Date().toISOString()
        };
        showToast('Lead Atualizado!', `${name} teve seus dados atualizados com sucesso.`, 'success');
      }
    } else {
      // Create new
      const newLead = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name,
        phone,
        service,
        status,
        value,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      leads.unshift(newLead);
      showToast('Lead Cadastrado!', `${name} foi adicionado ao CRM.`, 'success');
    }

    saveLeads();
    closeLeadModal();
    renderAll();
  }

  /* ==========================================================================
     Direct Status Changer & Conversion Prompt Modal
     ========================================================================== */

  function handleStatusQuickChange(e) {
    const select = e.target;
    const leadId = select.dataset.id;
    const newStatus = select.value;
    const lead = leads.find(l => l.id === leadId);

    if (!lead) return;

    if (newStatus === 'Lead convertido') {
      // Open the prompt modal to enter the sale value
      promptLeadId.value = leadId;
      promptLeadName.textContent = `Cliente: ${lead.name} (${lead.service})`;
      promptValueInput.value = lead.value > 0 ? lead.value.toFixed(2).replace('.', ',') : '';
      promptValueError.classList.remove('visible');
      promptValueInput.classList.remove('has-error');
      conversionPromptModal.classList.add('active');
      conversionPromptModal.setAttribute('aria-hidden', 'false');
      promptValueInput.focus();
    } else {
      // Direct status change
      lead.status = newStatus;
      if (newStatus === 'Lead perdido') {
        lead.value = 0;
      }
      lead.updatedAt = new Date().toISOString();
      saveLeads();
      renderAll();
      showToast('Status Atualizado', `Lead alterado para "${newStatus}".`, 'info');
    }
  }

  function confirmPromptConversion() {
    const val = parseCurrency(promptValueInput.value);
    if (val <= 0) {
      promptValueError.classList.add('visible');
      promptValueInput.classList.add('has-error');
      return;
    }

    const leadId = promptLeadId.value;
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = 'Lead convertido';
      lead.value = val;
      lead.updatedAt = new Date().toISOString();
      saveLeads();
      renderAll();
      showToast('Venda Fechada! 🏆', `Faturamento de ${formatCurrency(val)} registrado para ${lead.name}.`, 'success');
    }

    closePromptModal();
  }

  function closePromptModal() {
    conversionPromptModal.classList.remove('active');
    conversionPromptModal.setAttribute('aria-hidden', 'true');
    renderAll(); // Re-render to restore correct selected state if cancelled
  }

  /* ==========================================================================
     Lead Details Modal
     ========================================================================== */

  function openLeadDetailsModal(id) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    currentDetailLeadId = id;
    detailLeadName.textContent = lead.name;
    detailLeadDate.textContent = `Cadastrado em ${formatDate(lead.createdAt)}`;
    detailLeadPhone.textContent = lead.phone;
    detailWhatsappLink.href = getWhatsAppUrl(lead.phone, lead.name);
    detailLeadService.textContent = lead.service;
    detailLeadStatusBadge.innerHTML = getStatusBadgeHtml(lead.status);
    detailLeadValue.textContent = lead.status === 'Lead convertido' ? formatCurrency(lead.value) : '—';
    detailLeadNotes.textContent = lead.notes || 'Nenhuma observação ou anotação cadastrada para este lead.';

    leadDetailsModal.classList.add('active');
    leadDetailsModal.setAttribute('aria-hidden', 'false');
  }

  function closeLeadDetailsModal() {
    leadDetailsModal.classList.remove('active');
    leadDetailsModal.setAttribute('aria-hidden', 'true');
    currentDetailLeadId = null;
  }

  function deleteLead(id) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    const confirmed = confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`);
    if (confirmed) {
      leads = leads.filter(l => l.id !== id);
      saveLeads();
      renderAll();
      showToast('Lead Excluído', `O lead foi removido com sucesso.`, 'info');
    }
  }

  /* ==========================================================================
     Event Listeners Setup
     ========================================================================== */

  function setupEventListeners() {
    // Lead Form Openers & Closers
    btnOpenNewLeadModal.addEventListener('click', openNewLeadModal);
    btnEmptyAddLead.addEventListener('click', openNewLeadModal);
    btnCloseLeadModal.addEventListener('click', closeLeadModal);
    btnCancelLeadModal.addEventListener('click', closeLeadModal);

    // Click outside modal to close
    [leadModal, conversionPromptModal, leadDetailsModal].forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    });

    // Form submission
    leadForm.addEventListener('submit', handleLeadFormSubmit);

    // Toggle Lead Value input visibility based on status selection in form
    leadStatusSelect.addEventListener('change', () => {
      if (leadStatusSelect.value === 'Lead convertido') {
        leadValueContainer.style.display = 'flex';
        leadValueInput.focus();
      } else {
        leadValueContainer.style.display = 'none';
        leadValueInput.value = '';
      }
    });

    // Phone mask on input
    leadPhoneInput.addEventListener('input', e => {
      e.target.value = formatPhoneInput(e.target.value);
    });

    // Currency formatting on input
    leadValueInput.addEventListener('input', e => {
      formatCurrencyInput(e.target);
    });
    promptValueInput.addEventListener('input', e => {
      formatCurrencyInput(e.target);
    });

    // Prompt Conversion Modal Actions
    btnConfirmPromptConversion.addEventListener('click', confirmPromptConversion);
    btnCancelPrompt.addEventListener('click', closePromptModal);
    btnClosePromptModal.addEventListener('click', closePromptModal);
    promptValueInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmPromptConversion();
      }
    });

    // Details Modal Actions
    btnCloseDetailModal.addEventListener('click', closeLeadDetailsModal);
    btnEditFromDetail.addEventListener('click', () => {
      const id = currentDetailLeadId;
      closeLeadDetailsModal();
      openEditLeadModal(id);
    });
    btnDeleteFromDetail.addEventListener('click', () => {
      const id = currentDetailLeadId;
      closeLeadDetailsModal();
      deleteLead(id);
    });

    // Table delegated actions
    leadsTableBody.addEventListener('click', e => {
      const target = e.target;
      const tr = target.closest('tr');
      if (!tr) return;
      const id = tr.dataset.id;

      const actionBtn = target.closest('[data-action]');
      if (actionBtn) {
        const action = actionBtn.dataset.action;
        if (action === 'view') {
          openLeadDetailsModal(id);
        } else if (action === 'edit') {
          openEditLeadModal(id);
        } else if (action === 'delete') {
          deleteLead(id);
        }
      } else if (target.classList.contains('lead-name-text')) {
        openLeadDetailsModal(id);
      }
    });

    // Status Quick Change in Table
    leadsTableBody.addEventListener('change', e => {
      if (e.target.classList.contains('status-quick-select')) {
        handleStatusQuickChange(e);
      }
    });

    // Search input
    searchInput.addEventListener('input', e => {
      currentSearchQuery = e.target.value;
      btnClearSearch.style.display = currentSearchQuery ? 'block' : 'none';
      renderAll();
    });

    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      btnClearSearch.style.display = 'none';
      renderAll();
      searchInput.focus();
    });

    // Filter by Status
    filterStatus.addEventListener('change', e => {
      currentFilterStatus = e.target.value;
      renderAll();
    });

    // Sort
    sortLeads.addEventListener('change', e => {
      currentSort = e.target.value;
      renderAll();
    });

    // View Switcher (Table vs Pipeline)
    btnViewTable.addEventListener('click', () => {
      currentView = 'table';
      btnViewTable.classList.add('active');
      btnViewTable.setAttribute('aria-selected', 'true');
      btnViewPipeline.classList.remove('active');
      btnViewPipeline.setAttribute('aria-selected', 'false');
      tableViewContainer.classList.add('active');
      pipelineViewContainer.classList.remove('active');
    });

    btnViewPipeline.addEventListener('click', () => {
      currentView = 'pipeline';
      btnViewPipeline.classList.add('active');
      btnViewPipeline.setAttribute('aria-selected', 'true');
      btnViewTable.classList.remove('active');
      btnViewTable.setAttribute('aria-selected', 'false');
      pipelineViewContainer.classList.add('active');
      tableViewContainer.classList.remove('active');
    });

    // JSON Export / Backup
    btnExportJson.addEventListener('click', exportJsonBackup);

    // JSON Import / Restore
    btnImportJsonTrigger.addEventListener('click', triggerImportJson);
    jsonFileInput.addEventListener('change', handleJsonFileSelect);

    // Sample Data loader
    btnSampleData.addEventListener('click', () => {
      if (confirm('Deseja recarregar a lista com os exemplos padrão de demonstração?')) {
        leads = [...INITIAL_SAMPLE_LEADS];
        saveLeads();
        renderAll();
        showToast('Dados de Demonstração', 'Lista de leads restaurada com exemplos.', 'info');
      }
    });

    // Keyboard Shortcuts (Escape to close modals)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeLeadModal();
        closePromptModal();
        closeLeadDetailsModal();
      }
    });
  }

  /* ==========================================================================
     Initialize Application
     ========================================================================== */
  function init() {
    loadLeads();
    setupEventListeners();
    renderAll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
