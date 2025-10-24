'use client';

import { useEffect, useState } from 'react';
import { getAllQuotes, updateQuoteStatus } from '../actions/quotes';
import { formatCurrency } from '@/lib/pricing-calculator';

interface Quote {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_type: string;
  guest_count: number;
  cocktail_style: string;
  service_level: string;
  total_price: number;
  status: string;
}

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadQuotes();
  }, [filter]);

  const loadQuotes = async () => {
    setLoading(true);
    const result = await getAllQuotes(filter === 'all' ? undefined : filter);
    if (result.success && result.data) {
      setQuotes(result.data as Quote[]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (quoteId: string, newStatus: any) => {
    await updateQuoteStatus(quoteId, newStatus);
    loadQuotes();
  };

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    contacted: quotes.filter(q => q.status === 'contacted').length,
    converted: quotes.filter(q => q.status === 'converted').length,
    totalValue: quotes.reduce((sum, q) => sum + parseFloat(q.total_price.toString()), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-deep-purple mb-2">
            Panel de Administración
          </h1>
          <p className="text-deep-purple/70">
            Gestiona cotizaciones y reservaciones
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-sm text-gray-600 mb-1">Total Cotizaciones</div>
            <div className="text-3xl font-bold text-deep-purple">{stats.total}</div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-6 shadow">
            <div className="text-sm text-gray-600 mb-1">Pendientes</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 shadow">
            <div className="text-sm text-gray-600 mb-1">Contactados</div>
            <div className="text-3xl font-bold text-blue-600">{stats.contacted}</div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 shadow">
            <div className="text-sm text-gray-600 mb-1">Convertidos</div>
            <div className="text-3xl font-bold text-green-600">{stats.converted}</div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 shadow">
            <div className="text-sm text-gray-600 mb-1">Valor Total</div>
            <div className="text-2xl font-bold text-electric-purple">
              {formatCurrency(stats.totalValue)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow flex gap-2 overflow-x-auto">
          {['all', 'pending', 'contacted', 'converted', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-electric-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Todas' : status === 'pending' ? 'Pendientes' : status === 'contacted' ? 'Contactados' : status === 'converted' ? 'Convertidos' : 'Declinados'}
            </button>
          ))}
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Cargando...
            </div>
          ) : quotes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No hay cotizaciones aún
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invitados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(quote.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{quote.customer_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{quote.customer_email}</div>
                        <div>{quote.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{quote.event_type}</div>
                        <div className="text-gray-500 text-xs">{quote.cocktail_style}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.guest_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(parseFloat(quote.total_price.toString()))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            quote.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                            quote.status === 'converted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="contacted">Contactado</option>
                          <option value="converted">Convertido</option>
                          <option value="declined">Declinado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`https://wa.me/${quote.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${quote.customer_name}! Vi tu cotización para ${quote.guest_count} personas. ¿Cuándo podemos hablar?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-mint hover:text-mint/80 font-medium"
                        >
                          💬 WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-mint/10 rounded-xl p-6">
          <h3 className="font-bold text-deep-purple mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-6 py-3 bg-white rounded-lg hover:shadow transition-shadow text-left">
              <div className="font-medium text-deep-purple">📊 Exportar Datos</div>
              <div className="text-sm text-gray-600">Descargar CSV de cotizaciones</div>
            </button>
            <button className="px-6 py-3 bg-white rounded-lg hover:shadow transition-shadow text-left">
              <div className="font-medium text-deep-purple">📧 Email Masivo</div>
              <div className="text-sm text-gray-600">Enviar seguimiento a pendientes</div>
            </button>
            <button className="px-6 py-3 bg-white rounded-lg hover:shadow transition-shadow text-left">
              <div className="font-medium text-deep-purple">📅 Calendario</div>
              <div className="text-sm text-gray-600">Ver eventos próximos</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

