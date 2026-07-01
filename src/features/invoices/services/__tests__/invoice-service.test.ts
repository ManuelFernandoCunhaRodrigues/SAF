import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock da instância Axios compartilhada antes de importar o service
vi.mock('@/shared/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { generateInvoiceBoleto, generateInvoicePix } from '../invoice-service';
import { api } from '@/shared/services/api';

const mockPost = vi.mocked(api.post);

describe('invoice-service — generateInvoiceBoleto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('chama POST /invoices/:id/boleto com o invoiceId correto', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        chargeId: '123',
        digitableLine: '03399...',
        status: 'waiting',
        amount: 150,
        expiresAt: '2026-07-10T00:00:00.000Z',
      },
    });

    await generateInvoiceBoleto('inv-001');

    expect(mockPost).toHaveBeenCalledWith('/invoices/inv-001/boleto');
  });

  it('não envia payload adicional (sem credenciais Efí)', async () => {
    mockPost.mockResolvedValueOnce({ data: {} });

    await generateInvoiceBoleto('inv-002');

    // api.post deve ser chamado apenas com a URL — sem segundo argumento de body
    expect(mockPost.mock.calls[0]).toHaveLength(1);
  });

  it('não contém "efipay" ou "gerencianet" na URL chamada', async () => {
    mockPost.mockResolvedValueOnce({ data: {} });

    await generateInvoiceBoleto('inv-003');

    const [url] = mockPost.mock.calls[0] as [string];
    expect(url).not.toMatch(/efipay|gerencianet/i);
  });

  it('retorna os dados da resposta diretamente', async () => {
    const payload = {
      chargeId: '999',
      digitableLine: '00190.00009 01234.567890',
      status: 'waiting',
      amount: 200,
      expiresAt: '2026-08-01T00:00:00.000Z',
    };
    mockPost.mockResolvedValueOnce({ data: payload });

    const result = await generateInvoiceBoleto('inv-004');

    expect(result).toEqual(payload);
  });
});

// ── não regressão: Pix ────────────────────────────────────────────────────────

describe('invoice-service — generateInvoicePix (não regressão)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exporta generateInvoicePix como função', () => {
    expect(typeof generateInvoicePix).toBe('function');
  });

  it('chama POST /invoices/:id/pix', async () => {
    mockPost.mockResolvedValueOnce({
      data: { txid: 'abc', pixCopyPaste: '00020126...', qrCodeImage: '', amount: 100, expiresAt: null },
    });

    await generateInvoicePix('inv-pix-001');

    expect(mockPost).toHaveBeenCalledWith('/invoices/inv-pix-001/pix');
  });

  it('não envia payload (sem credenciais Efí)', async () => {
    mockPost.mockResolvedValueOnce({ data: {} });

    await generateInvoicePix('inv-pix-002');

    expect(mockPost.mock.calls[0]).toHaveLength(1);
  });
});
