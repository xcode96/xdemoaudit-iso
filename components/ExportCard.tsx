import React, { useState } from 'react';
import Card from './Card';
import type { Category } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportCardProps {
  categories: Category[];
  baseline: { overall: number; themes: Record<string, number> } | null;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ExportCard: React.FC<ExportCardProps> = ({ categories, baseline }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = () => {
        setIsLoading(true);

        try {
            const doc = new jsPDF();

            // 1. Cover Page
            doc.setFontSize(22);
            doc.text("ISO 27001 Internal Audit Report", 105, 80, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 105, 100, { align: 'center' });
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("This document contains a summary of the audit findings and corrective actions.", 105, 120, { align: 'center' });


            // 2. Summary of Conformance
            doc.addPage();
            doc.setFontSize(18);
            doc.text("Summary of Conformance", 14, 22);

            const allItems = categories.flatMap(c => c.items);
            const auditableItems = allItems.filter(item => item.status !== 'Not Applicable' && typeof item.scope === 'number' && typeof item.criticality === 'number' && typeof item.impact === 'number');
            const totalPossibleWeight = auditableItems.reduce((sum, item) => sum + (item.scope! * item.criticality! * item.impact!), 0);
            const conformantWeight = auditableItems.reduce((sum, item) => (item.status === 'Conformant' ? sum + (item.scope! * item.criticality! * item.impact!) : sum), 0);
            const overallConformance = totalPossibleWeight > 0 ? Math.round((conformantWeight / totalPossibleWeight) * 100) : 0;

            doc.setFontSize(12);
            doc.text(`Overall Weighted Conformance: ${overallConformance}%`, 14, 40);
            if(baseline) {
                doc.text(`Baseline Conformance: ${baseline.overall}%`, 14, 55);
            }

            const summaryBody = categories.map(category => {
                const catAuditableItems = category.items.filter(item => item.status !== 'Not Applicable' && typeof item.scope === 'number' && typeof item.criticality === 'number' && typeof item.impact === 'number');
                const catTotalPossibleWeight = catAuditableItems.reduce((sum, item) => sum + (item.scope! * item.criticality! * item.impact!), 0);
                const catConformantWeight = catAuditableItems.reduce((sum, item) => (item.status === 'Conformant' ? sum + (item.scope! * item.criticality! * item.impact!) : sum), 0);
                const conformance = catTotalPossibleWeight > 0 ? Math.round((catConformantWeight / catTotalPossibleWeight) * 100) : 0;
                const auditedCount = category.items.filter(i => i.status !== 'Not Audited').length;
                return [
                    category.title,
                    `${conformance}%`,
                    `${baseline?.themes[category.id] || 'N/A'}%`,
                    `${auditedCount} / ${category.total}`
                ];
            });

            autoTable(doc, {
                startY: 70,
                head: [['Theme', 'Conformance', 'Baseline', 'Audited']],
                body: summaryBody,
                theme: 'striped',
                headStyles: { fillColor: [45, 55, 72] },
            });

            // 3. Key Findings
            const keyFindings = categories.flatMap(c => c.items).filter(item => item.status === 'Non-Conformant');
            if (keyFindings.length > 0) {
                doc.addPage();
                doc.setFontSize(18);
                doc.text("Key Findings (Non-Conformities)", 14, 22);
                
                const findingsBody = keyFindings.map(item => [item.security, item.details, item.evidence || 'N/A']);
                
                autoTable(doc, {
                    startY: 30,
                    head: [['Control', 'Details', 'Auditor Notes']],
                    body: findingsBody,
                    theme: 'striped',
                    headStyles: { fillColor: [45, 55, 72] },
                });
            }

            // 4. Corrective Action Plan
             const actionItems = categories.flatMap(c => c.items).filter(item => item.status === 'Non-Conformant' || item.status === 'Observation');
             if (actionItems.length > 0) {
                doc.addPage();
                doc.setFontSize(18);
                doc.text("Corrective Action Plan", 14, 22);

                const actionsBody = actionItems.map(item => [item.security, item.status, item.details, `${item.effortTech || 'N/A'} tech · ${item.effortPeople || 'N/A'} people`]);

                 autoTable(doc, {
                    startY: 30,
                    head: [['Control', 'Status', 'Recommendation', 'Est. Effort']],
                    body: actionsBody,
                    theme: 'striped',
                    headStyles: { fillColor: [45, 55, 72] },
                });
             }

            // 5. Appendix: Full Audit Details
            doc.addPage();
            doc.setFontSize(18);
            doc.text("Appendix: Full Audit Details", 14, 22);

            categories.forEach((category, index) => {
                const isFirstTableOnPage = index === 0;
                const titleY = (doc as any).lastAutoTable && !isFirstTableOnPage ? (doc as any).lastAutoTable.finalY + 20 : 40;
                
                autoTable(doc, {
                    startY: titleY,
                    body: [[{ content: category.title, styles: { fontStyle: 'bold', fontSize: 14, fillColor: [74, 85, 104], textColor: 255 } }]],
                    theme: 'plain'
                });

                const itemsBody = category.items.map(item => [
                    item.security,
                    item.clause || 'N/A', 
                    item.status, 
                    item.evidence || ''
                ]);

                autoTable(doc, {
                    startY: (doc as any).lastAutoTable.finalY,
                    head: [['Control', 'Clause', 'Status', 'Evidence']],
                    body: itemsBody,
                    theme: 'striped',
                    headStyles: { fillColor: [45, 55, 72] },
                    columnStyles: { 
                        0: { cellWidth: 150 },
                        1: { cellWidth: 50 },
                        2: { cellWidth: 80 },
                        3: { cellWidth: 'auto' } 
                    }
                });
            });
            
            doc.save('iso-audit-report.pdf');

        } catch (error) {
            console.error("Failed to generate PDF", error);
            alert("An error occurred while generating the PDF. Please check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-4">Reporting</h2>
            <p className="text-gray-400 text-sm mb-4">
                Generate a comprehensive PDF report of the entire audit, including summaries, findings, and detailed control statuses.
            </p>
            <button
                onClick={handleExport}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Generating Report...' : 'Export Full Report as PDF'}
            </button>
        </Card>
    );
};

export default ExportCard;
