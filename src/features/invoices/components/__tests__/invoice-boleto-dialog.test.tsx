import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvoiceBoletoDialog } from '../invoice-boleto-dialog';
import type { Invoice, InvoiceBoletoData } from '../../types/invoice';

// ── fixtures ─────────────────────────────────────────────────────────────────

const mockPendingInvoice: Invoice = {
  id: 'inv-001',
  number: 'INV-001',
  clientName: 'Cliente Teste',
  clientEmail: 'teste@email.com',
  amount: 150,
  status: 'pending',
  dueDate: '2026-07-10',
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
};

const mockPaidInvoice: Invoice = { ...mockPendingInvoice, status: 'paid' };
const mockCancelledInvoice: Invoice = { ...mockPendingInvoice, status: 'cancelled' };

const mockBoletoData: InvoiceBoletoData = {
  chargeId: '123456',
  digitableLine: '03399.33335 33335.162033 01629.541180 7 00000000015000',
  status: 'waiting',
  amount: 150,
  expiresAt: '2026-07-10T00:00:00.000Z',
  boletoUrl: 'https://example.com/boleto/123456',
  pdfUrl: 'https://example.com/pdf/123456',
};

// ── helper ────────────────────────────────────────────────────────────────────

type DialogProps = Partial<{
  invoice: Invoice;
  boletoData: InvoiceBoletoData | null;
  isLoading: boolean;
  errorMessage: string | null;
  onGenerateBoleto: () => void;
}>;

function renderDialog({
  invoice = mockPendingInvoice,
  boletoData = null,
  isLoading = false,
  errorMessage = null,
  onGenerateBoleto,
}: DialogProps = {}) {
  const spy = onGenerateBoleto ?? vi.fn();
  render(
    <InvoiceBoletoDialog
      open={true}
      onOpenChange={vi.fn()}
      invoice={invoice}
      boletoData={boletoData}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onGenerateBoleto={spy}
    />,
  );
  return { spy };
}

// ── testes ────────────────────────────────────────────────────────────────────

describe('InvoiceBoletoDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Renderiza botão "Gerar boleto" no estado inicial
  it('renderiza o botão "Gerar boleto" no estado inicial', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: /gerar boleto/i })).toBeInTheDocument();
  });

  // 2. NÃO dispara geração automática ao montar (principal correção)
  it('NÃO chama onGenerateBoleto automaticamente ao montar o dialog', () => {
    const { spy } = renderDialog();
    expect(spy).not.toHaveBeenCalled();
  });

  // 3. Dispara geração apenas ao clicar
  it('chama onGenerateBoleto exatamente uma vez ao clicar em "Gerar boleto"', () => {
    const { spy } = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: /gerar boleto/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // 4. Loading: spinner visível, botão de geração oculto
  it('mostra "Gerando boleto..." durante loading e oculta o botão de geração', () => {
    renderDialog({ isLoading: true });
    expect(screen.getByText(/gerando boleto/i)).toBeInTheDocument();
    // botão de geração explícito não aparece (ele só existe no estado idle)
    expect(screen.queryByRole('button', { name: /^gerar boleto$/i })).not.toBeInTheDocument();
  });

  // 5. Sucesso: linha digitável visível
  it('exibe a linha digitável após geração bem-sucedida', () => {
    renderDialog({ boletoData: mockBoletoData });
    expect(
      screen.getByText('03399.33335 33335.162033 01629.541180 7 00000000015000'),
    ).toBeInTheDocument();
  });

  // 6. Sucesso: botão copiar
  it('exibe o botão "Copiar linha digitável" em sucesso', () => {
    renderDialog({ boletoData: mockBoletoData });
    expect(screen.getByRole('button', { name: /copiar linha digitável/i })).toBeInTheDocument();
  });

  // 7a. Botão PDF existe quando pdfUrl está presente
  it('exibe botão "Abrir PDF" quando pdfUrl existe', () => {
    renderDialog({ boletoData: mockBoletoData });
    expect(screen.getByRole('button', { name: /abrir pdf/i })).toBeInTheDocument();
  });

  // 7b. Botão PDF ausente quando pdfUrl não existe
  it('NÃO exibe botão "Abrir PDF" quando pdfUrl está ausente', () => {
    renderDialog({ boletoData: { ...mockBoletoData, pdfUrl: undefined } });
    expect(screen.queryByRole('button', { name: /abrir pdf/i })).not.toBeInTheDocument();
  });

  // 8. Erro: mensagem amigável + botão retry
  it('exibe mensagem de erro amigável e botão "Tentar novamente"', () => {
    renderDialog({
      errorMessage: 'Verifique se o cliente possui documento e endereço completos.',
    });
    expect(screen.getByText(/verifique/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  // 9a. Fatura paga: bloqueio com mensagem
  it('não permite gerar boleto para fatura paga', () => {
    renderDialog({ invoice: mockPaidInvoice });
    expect(screen.queryByRole('button', { name: /gerar boleto/i })).not.toBeInTheDocument();
    expect(screen.getByText(/fatura já está paga/i)).toBeInTheDocument();
  });

  // 9b. Fatura cancelada: bloqueio com mensagem
  it('não permite gerar boleto para fatura cancelada', () => {
    renderDialog({ invoice: mockCancelledInvoice });
    expect(screen.queryByRole('button', { name: /gerar boleto/i })).not.toBeInTheDocument();
    // Verifica a mensagem explicativa (mais específica que o título)
    expect(
      screen.getByText(/não é possível gerar boleto para uma fatura cancelada/i),
    ).toBeInTheDocument();
  });

  // Cópia: feedback "Linha copiada!" após clipboard.writeText resolver
  it('exibe "Linha copiada!" após cópia bem-sucedida via clipboard API', async () => {
    vi.mocked(navigator.clipboard.writeText).mockResolvedValueOnce(undefined);
    renderDialog({ boletoData: mockBoletoData });

    fireEvent.click(screen.getByRole('button', { name: /copiar linha digitável/i }));

    await waitFor(() => {
      expect(screen.getByText(/linha copiada/i)).toBeInTheDocument();
    });
  });

  // Cópia: feedback de erro quando clipboard falha e execCommand retorna false
  it('exibe feedback de erro quando cópia falha', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('denied'));
    // jsdom não implementa execCommand — define como fn que retorna false
    Object.defineProperty(document, 'execCommand', {
      writable: true,
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });
    renderDialog({ boletoData: mockBoletoData });

    fireEvent.click(screen.getByRole('button', { name: /copiar linha digitável/i }));

    await waitFor(() => {
      expect(screen.getByText(/não foi possível copiar/i)).toBeInTheDocument();
    });
  });
});
