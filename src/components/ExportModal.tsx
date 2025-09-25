import { useState } from 'react';
import jsPDF from 'jspdf';
import type { Goal, Marker, Participant } from '../types';
import { Download, X, Loader } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  markers: Marker[];
  participants: Participant[];
}

export function ExportModal({
  isOpen,
  onClose,
  goals,
  markers,
  participants,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'image'>('pdf');

  const getParticipantName = (participantId: string) => {
    return participants.find(p => p.id === participantId)?.name || 'Okänd';
  };

  const getGoalMarkers = (goalId: string) => {
    return markers.filter(m => m.goalId === goalId);
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Create PDF directly with text content
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Retrospektiv Måltavla', 20, 30);
      
      // Add dart board representation (moved down to avoid title overlap)
      const centerX = 105;
      const centerY = 120;
      const maxRadius = 50;
      
      // Draw dart board circles
      for (let i = 0; i < 8; i++) {
        const radius = maxRadius - (i * 7);
        const isBlack = i % 2 === 0;
        pdf.setFillColor(isBlack ? 0 : 255, isBlack ? 0 : 255, isBlack ? 0 : 255);
        pdf.circle(centerX, centerY, radius, 'F');
      }
      
      // Draw bullseye
      pdf.setFillColor(220, 38, 38); // Red
      pdf.circle(centerX, centerY, 8, 'F');
      pdf.setFillColor(251, 191, 36); // Yellow
      pdf.circle(centerX, centerY, 4, 'F');
      
      // Add markers
      markers.forEach((marker) => {
        const participant = participants.find(p => p.id === marker.participantId);
        const x = centerX + (marker.position.x - 50) * 0.8;
        const y = centerY + (marker.position.y - 50) * 0.8;
        
        // Draw marker circle
        pdf.setFillColor(parseInt(marker.color.slice(1, 3), 16), 
                        parseInt(marker.color.slice(3, 5), 16), 
                        parseInt(marker.color.slice(5, 7), 16));
        pdf.circle(x, y, 3, 'F');
        
        // Add score text
        pdf.setFontSize(8);
        pdf.text(marker.score.toString(), x - 1, y + 1);
        
        // Add participant name below
        if (participant) {
          pdf.setFontSize(6);
          pdf.text(participant.name, x - 10, y + 8);
        }
      });
      

      // Add goals list
      pdf.addPage();
      pdf.setFontSize(20);
      pdf.text('Mål & Aktiviteter', 20, 30);

      let yPosition = 50;
      pdf.setFontSize(12);

      goals.forEach((goal, index) => {
        // Goal title
        pdf.setFontSize(14);
        pdf.text(`${index + 1}. ${goal.text}`, 20, yPosition);
        yPosition += 10;

        // Goal markers
        const goalMarkers = getGoalMarkers(goal.id);
        if (goalMarkers.length > 0) {
          pdf.setFontSize(10);
          goalMarkers.forEach((marker) => {
            const participantName = getParticipantName(marker.participantId);
            pdf.text(`  • ${participantName}: ${marker.score} poäng`, 30, yPosition);
            yPosition += 6;
          });
        } else {
          pdf.setFontSize(10);
          pdf.text('  Inga markeringar', 30, yPosition);
          yPosition += 6;
        }

        yPosition += 10;

        // Add page break if needed
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
      });

      // Add summary
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Sammanfattning', 20, 30);

      pdf.setFontSize(12);
      pdf.text(`Antal mål: ${goals.length}`, 20, 50);
      pdf.text(`Antal deltagare: ${participants.length}`, 20, 60);
      pdf.text(`Antal markeringar: ${markers.length}`, 20, 70);

      // Save the PDF
      pdf.save('retrospektiv-maltavla.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Ett fel uppstod vid export. Försök igen.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToImage = async () => {
    setIsExporting(true);
    try {
      // Create a simple canvas-based export
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      canvas.width = 800;
      canvas.height = 600;
      
      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw title
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Retrospektiv Måltavla', canvas.width / 2, 50);
      
      // Draw dart board (moved down to avoid title overlap)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 50;
      const maxRadius = 180;
      
      // Draw dart board circles
      for (let i = 0; i < 8; i++) {
        const radius = maxRadius - (i * 25);
        const isBlack = i % 2 === 0;
        ctx.fillStyle = isBlack ? '#000000' : '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw bullseye
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw markers
      markers.forEach((marker) => {
        const participant = participants.find(p => p.id === marker.participantId);
        const x = centerX + (marker.position.x - 50) * 3.2;
        const y = centerY + (marker.position.y - 50) * 3.2;
        
        // Draw marker circle
        ctx.fillStyle = marker.color;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add score text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(marker.score.toString(), x, y + 4);
        
        // Add participant name
        if (participant) {
          ctx.fillStyle = '#000000';
          ctx.font = '10px Arial';
          ctx.fillText(participant.name, x, y + 25);
        }
      });
      
      
      // Download the image
      const link = document.createElement('a');
      link.download = 'retrospektiv-maltavla.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Ett fel uppstod vid export. Försök igen.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPDF();
    } else {
      exportToImage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Exportera resultat</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exportformat
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'image')}
                  className="mr-2"
                />
                <span className="text-sm">PDF (rekommenderat)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="image"
                  checked={exportFormat === 'image'}
                  onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'image')}
                  className="mr-2"
                />
                <span className="text-sm">Bild (PNG)</span>
              </label>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>PDF-exporten innehåller:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Måltavlan med alla markörer</li>
              <li>Lista över mål och markeringar</li>
              <li>Sammanfattning av resultatet</li>
            </ul>
          </div>


          <div className="flex gap-2 pt-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? 'Exporterar...' : 'Exportera'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
