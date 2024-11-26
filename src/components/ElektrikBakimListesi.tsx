import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Building, Calendar, User, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ElektrikBakim } from '../types';

interface Props {
  bakimlar: ElektrikBakim[];
  sahalar: Array<{id: string, ad: string}>;
  onBakimTikla: (bakim: ElektrikBakim) => void;
  onBakimSil?: (id: string) => void;
}

export const ElektrikBakimListesi: React.FC<Props> = ({ 
  bakimlar, 
  sahalar,
  onBakimTikla,
  onBakimSil
}) => {
  const getSahaAdi = (sahaId: string) => {
    return sahalar.find(s => s.id === sahaId)?.ad || 'Bilinmeyen Saha';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tarih
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kontrol Eden
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fotoğraf
            </th>
            {onBakimSil && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bakimlar.map((bakim) => {
            const sorunluDurumSayisi = Object.values(bakim.durumlar).reduce((acc, kategori) => {
              return acc + Object.values(kategori).filter(durum => durum === false).length;
            }, 0);
            const sorunVar = sorunluDurumSayisi > 0;
            
            return (
              <tr
                key={bakim.id}
                onClick={() => onBakimTikla(bakim)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{getSahaAdi(bakim.sahaId)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(bakim.tarih.toDate(), 'dd MMM yyyy HH:mm', { locale: tr })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    {bakim.kontrolEden.ad}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sorunVar ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {sorunVar ? (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {sorunluDurumSayisi} Sorun
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Sorun Yok
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bakim.fotograflar?.length || 0} Fotoğraf
                </td>
                {onBakimSil && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBakimSil(bakim.id);
                      }}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};