import { formatCurrency } from '$lib/shared/utils';
import type {
	QuotationComparisonData,
	ComparisonQuotation,
	ComparisonItem,
	ComparisonQuotationItem,
	ComparisonEquivalentItem,
	PendingVendor
} from '../types/local-purchase-analysis.types';

const VENDORS_PER_PAGE = 4;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function v(val: string | number | null | undefined): string {
	if (val === null || val === undefined || val === '') return '-';
	return String(val);
}

function fmtDate(val: string | null | undefined): string {
	if (!val) return '-';
	try {
		return new Date(val).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	} catch {
		return val;
	}
}

function fmtPct(val: number | null | undefined): string {
	if (val === null || val === undefined) return '-';
	const sign = val >= 0 ? '+' : '';
	return `${sign}${val.toFixed(1)}%`;
}

function findQItem(
	q: ComparisonQuotation,
	rfqItem: ComparisonItem
): ComparisonQuotationItem | undefined {
	return q.items.find((qi) => qi.rfq_detail_id === rfqItem.uoid);
}

function buildEquivBlock(
	equiv: ComparisonEquivalentItem,
	rfqItem: ComparisonItem,
	eIdx: number
): string {
	const stockDisplay =
		equiv.jumlah_tersedia != null && equiv.jumlah_tersedia > 0
			? `${equiv.jumlah_tersedia} ${rfqItem.uom}`
			: equiv.stock_qty > 0
				? `${equiv.stock_qty} ${rfqItem.uom}`
				: null;

	let html = `
    <div class="equiv-block">
      <div class="equiv-title">Ekuivalen ${eIdx + 1}:</div>
      <div class="field equiv-code">${v(equiv.equivalent_item_code)}</div>
      <div class="field">${v(equiv.equivalent_item_name)}</div>
      <div class="price-satuan">[Satuan]: ${equiv.unit_price > 0 ? formatCurrency(equiv.unit_price) : '-'}</div>
      <div class="price-total">[Total]: ${equiv.total_price > 0 ? formatCurrency(equiv.total_price) : '-'}</div>`;

	if (equiv.equivalent_specifications)
		html += `<div class="field">Spec: ${equiv.equivalent_specifications}</div>`;
	if (equiv.equivalent_brand) html += `<div class="field">Merk: ${equiv.equivalent_brand}</div>`;
	if (equiv.equivalent_type) html += `<div class="field">Tipe: ${equiv.equivalent_type}</div>`;
	if (equiv.equivalent_manufacturer)
		html += `<div class="field">Buatan: ${equiv.equivalent_manufacturer}</div>`;
	if (stockDisplay) html += `<div class="field">Qty Tersedia: ${stockDisplay}</div>`;
	if (equiv.jumlah_inden != null && equiv.jumlah_inden > 0)
		html += `<div class="field">Qty Indent: ${equiv.jumlah_inden} ${rfqItem.uom}</div>`;
	if (equiv.lama_inden != null && equiv.lama_inden > 0)
		html += `<div class="field">Lama Indent: ${equiv.lama_inden} hari</div>`;
	if (equiv.masa_berlaku_harga)
		html += `<div class="field">Masa Berlaku Harga: ${fmtDate(equiv.masa_berlaku_harga)}</div>`;
	if (equiv.dibuat_oleh) html += `<div class="field">Dibuat Oleh: ${equiv.dibuat_oleh}</div>`;
	if (equiv.keterangan) html += `<div class="field">Keterangan: ${equiv.keterangan}</div>`;

	html += `</div>`;
	return html;
}

function buildMainItemVendorCell(q: ComparisonQuotation, rfqItem: ComparisonItem): string {
	const qItem = findQItem(q, rfqItem);

	// Vendor tidak ada item sama sekali untuk rfq_detail ini
	if (!qItem) return `<div class="tidak-merespons">Tidak Merespons</div>`;

	const equivs = qItem.equivalents || [];
	const hasOriginalPrice = qItem.unit_price > 0;
	const hasEquivPrice = equivs.some((e) => e.unit_price > 0);

	// Tidak ada harga sama sekali (original maupun equivalent)
	if (!hasOriginalPrice && !hasEquivPrice)
		return `<div class="tidak-merespons">Tidak Merespons</div>`;

	let html = '';

	if (hasOriginalPrice) {
		const stockDisplay =
			qItem.jumlah_tersedia != null && qItem.jumlah_tersedia > 0
				? `${qItem.jumlah_tersedia} ${rfqItem.uom}`
				: qItem.qty > 0
					? `${qItem.qty} ${rfqItem.uom}`
					: null;

		html += `
    <div class="price-satuan">[Satuan]: ${formatCurrency(qItem.unit_price)}</div>
    <div class="price-total">[Total]: ${formatCurrency(qItem.total_price)}</div>`;

		if (qItem.brand) html += `<div class="field">Merk: ${qItem.brand}</div>`;
		if (qItem.origin) html += `<div class="field">Asal: ${qItem.origin}</div>`;
		if (stockDisplay) html += `<div class="field">Qty Tersedia: ${stockDisplay}</div>`;
		if (qItem.jumlah_inden != null && qItem.jumlah_inden > 0)
			html += `<div class="field">Qty Indent: ${qItem.jumlah_inden} ${rfqItem.uom}</div>`;
		if (qItem.lama_inden != null && qItem.lama_inden > 0)
			html += `<div class="field">Lama Indent: ${qItem.lama_inden} hari</div>`;
		if (qItem.masa_berlaku_harga)
			html += `<div class="field">Masa Berlaku Harga: ${fmtDate(qItem.masa_berlaku_harga)}</div>`;
		if (qItem.dibuat_oleh) html += `<div class="field">Dibuat Oleh: ${qItem.dibuat_oleh}</div>`;
		if (qItem.budget_price != null && qItem.budget_price > 0)
			html += `<div class="field">Selisih Budget: ${formatCurrency(qItem.budget_price)} (${fmtPct(qItem.budget_price_comparison_percent)})</div>`;
		if (qItem.last_lpo_price != null && qItem.last_lpo_price > 0)
			html += `<div class="field">Selisih Last Price: ${formatCurrency(qItem.last_lpo_price)} (${fmtPct(qItem.price_comparison_percent)})</div>`;
		const keterangan = qItem.keterangan || qItem.notes;
		if (keterangan) html += `<div class="field">Keterangan: ${keterangan}</div>`;
	}

	equivs.forEach((equiv: ComparisonEquivalentItem, eIdx: number) => {
		html += buildEquivBlock(equiv, rfqItem, eIdx);
	});

	return html;
}

function buildPageHtml(
	data: QuotationComparisonData,
	allQuotations: ComparisonQuotation[],
	pageVendors: ComparisonQuotation[],
	vendorStartIndex: number,
	isLastPage: boolean,
	printDate: string,
	printedBy: string,
	logoBase64: string
): string {
	const vendorCount = pageVendors.length;
	const vendorColPct = vendorCount > 0 ? Math.floor(50 / vendorCount) : 10;

	const vendorHeaders = pageVendors
		.map((q, i) => {
			const letter = LETTERS[vendorStartIndex + i] || String(vendorStartIndex + i + 1);
			// Vendor tidak merespons jika tidak ada item dengan harga (original atau equivalent)
			const tidakMerespons = !q.items.some(
				(item) =>
					item.unit_price > 0 ||
					(item.equivalents?.length > 0 && item.equivalents.some((e) => e.unit_price > 0))
			);
			return `<th class="vendor-th">
        <div>${letter}. ${q.vendor_code}</div>
        <div class="vendor-name-h">${q.vendor_name}</div>
        <div class="vendor-rfq-num">${v(q.vendor_rfq_number)}</div>
        ${tidakMerespons ? '<div class="no-resp">(Tidak Merespons)</div>' : ''}
      </th>`;
		})
		.join('');

	let bodyRows = '';
	data.items.forEach((rfqItem, itemIndex) => {
		const vendorCells = pageVendors
			.map((q) => `<td class="vendor-td">${buildMainItemVendorCell(q, rfqItem)}</td>`)
			.join('');

		// Hitung harga terendah manual dari quotations (selalu akurat, skip unit_price=0)
		let lowestPrice = Infinity;
		let lowestVendorCode = '';
		let lowestVendorName = '';
		allQuotations.forEach((q) => {
			const qItem = findQItem(q, rfqItem);
			if (qItem && qItem.unit_price > 0 && qItem.unit_price < lowestPrice) {
				lowestPrice = qItem.unit_price;
				lowestVendorCode = q.vendor_code;
				lowestVendorName = q.vendor_name;
			}
			// Cek juga equivalents
			if (qItem?.equivalents?.length) {
				qItem.equivalents.forEach((equiv) => {
					if (equiv.unit_price > 0 && equiv.unit_price < lowestPrice) {
						lowestPrice = equiv.unit_price;
						lowestVendorCode = q.vendor_code;
						lowestVendorName = q.vendor_name;
					}
				});
			}
		});

		// Fallback ke analytics jika manual tidak menemukan (edge case)
		const itemAnalytic = data.analytics?.item_analytics?.find(
			(a) => a.item_code === rfqItem.item_code
		);
		if (lowestPrice === Infinity && itemAnalytic && itemAnalytic.lowest_unit_price > 0) {
			lowestPrice = itemAnalytic.lowest_unit_price;
			lowestVendorCode = itemAnalytic.lowest_price_vendor_code ?? '';
			lowestVendorName = itemAnalytic.lowest_price_vendor_name ?? '';
		}

		let lowestTotal = '-';
		let lowestUnit = '-';
		let lowestVendorInfo = '';

		if (lowestPrice < Infinity) {
			lowestUnit = formatCurrency(lowestPrice);
			lowestTotal = formatCurrency(lowestPrice * rfqItem.qty);
			if (lowestVendorName) {
				lowestVendorInfo = `<div class="total-vendor">${lowestVendorCode ? `${lowestVendorCode} - ` : ''}${lowestVendorName}</div>`;
			}
		}

		// Last LPO price from item
		const lastLpoDisplay =
			rfqItem.last_lpo_price != null && rfqItem.last_lpo_price > 0
				? formatCurrency(rfqItem.last_lpo_price)
				: '-';

		// Budget price from item
		const budgetDisplay =
			rfqItem.budget_price != null && rfqItem.budget_price > 0
				? formatCurrency(rfqItem.budget_price)
				: '-';

		bodyRows += `
      <tr>
        <td class="tc">${itemIndex + 1}</td>
        <td class="tc">${v(rfqItem.purchase_request_number)}</td>
        <td class="tc">${rfqItem.item_code}</td>
        <td>${rfqItem.item_name}${rfqItem.specifications ? `<div class="spec-text">${rfqItem.specifications}</div>` : ''}</td>
        <td class="tc">${rfqItem.qty}</td>
        <td class="tc">${rfqItem.uom}</td>
        <td class="last-price-cell">
          <div>Harga LPO Terakhir: ${lastLpoDisplay}</div>
          <div>Harga Budget: ${budgetDisplay}</div>
        </td>
        ${vendorCells}
        <td class="total-td">
          <div class="total-lowest">[Satuan]: ${lowestUnit}</div>
          <div class="total-unit">[Total]: ${lowestTotal}</div>
          ${lowestVendorInfo}
        </td>
        <td class="pemenang-td"></td>
      </tr>`;
	});

	const pageInfo =
		allQuotations.length > VENDORS_PER_PAGE
			? ` (Vendor ${vendorStartIndex + 1}–${vendorStartIndex + vendorCount} dari ${allQuotations.length})`
			: '';

	const logoImg = logoBase64
		? `<img src="${logoBase64}" alt="Logo Socfin" class="company-logo" />`
		: `<div class="company-name-text"><div class="company-name">PT SOCFIN INDONESIA</div><div class="company-sub">( SOCFINDO )</div></div>`;

	// Section vendor tidak merespons + PPN (hanya di halaman terakhir)
	// Gabungkan: pending_vendors dari API + quotation vendors yang tidak ada harga sama sekali
	const pendingVendors: PendingVendor[] = data.pending_vendors || [];
	const quotationNonResponders = allQuotations.filter(
		(q) =>
			!q.items.some(
				(item) =>
					item.unit_price > 0 ||
					(item.equivalents?.length > 0 && item.equivalents.some((e) => e.unit_price > 0))
			)
	);
	const nonRespondersSection = isLastPage
		? `<div class="non-responders-section">
      <div class="ppn-note">Harga belum termasuk PPN 11%</div>
      ${
				pendingVendors.length > 0 || quotationNonResponders.length > 0
					? `<div class="nr-label">Yang tidak merespon :</div>
        <table class="nr-table">
          ${pendingVendors
						.map(
							(v, i) => `<tr>
            <td class="nr-no">${i + 1}</td>
            <td class="nr-code">${v.vendor_code}</td>
            <td class="nr-name">${v.vendor_name}</td>
          </tr>`
						)
						.join('')}
          ${quotationNonResponders
						.map(
							(q, i) => `<tr>
            <td class="nr-no">${pendingVendors.length + i + 1}</td>
            <td class="nr-code">${q.vendor_code}</td>
            <td class="nr-name">${q.vendor_name}</td>
          </tr>`
						)
						.join('')}
        </table>`
					: ''
			}
    </div>`
		: '';

	const footer = isLastPage
		? `<div class="footer-wrap">
      <div class="footer-meta">
        <div>Dikirim ke Manager Kebun Tgl.</div>
        <div>Kembali dari Manager Kebun Tgl.</div>
        <div class="printed-by">Printed by: ${printedBy} / ${printDate}</div>
      </div>
      <div class="footer-right">
        <div class="sig-label">Disetujui Oleh</div>
        <div class="sig-space"></div>
        <div class="sig-name">Manager Kebun</div>
      </div>
    </div>`
		: '';

	return `
  <div class="page-wrap">
    <div class="report-header">
      <div class="company-block">
        ${logoImg}
      </div>
      <div class="title-block">
        <span class="title-text">PERBANDINGAN HARGA NO.&nbsp;&nbsp;${data.rfq_number}</span>
        <span class="title-date">&nbsp;&nbsp;&nbsp;TGL. ${printDate}${pageInfo}</span>
      </div>
    </div>

    <div class="table-wrap">
      <table class="main-table">
        <colgroup>
          <col style="width:2%">
          <col style="width:5%">
          <col style="width:5%">
          <col style="width:10%">
          <col style="width:3%">
          <col style="width:3%">
          <col style="width:7%">
          ${pageVendors.map(() => `<col style="width:${vendorColPct}%">`).join('')}
          <col style="width:7%">
          <col style="width:6%">
        </colgroup>
        <thead>
          <tr>
            <th>No.</th>
            <th>No MR</th>
            <th>Item Code</th>
            <th>Nama Barang</th>
            <th>Qty</th>
            <th>Satuan</th>
            <th>Harga Pembelian Terakhir Harga/Satuan</th>
            ${vendorHeaders}
            <th class="total-th">TOTAL HARGA TERENDAH<br/>(HRG TERENDAH x QTY)</th>
            <th class="pemenang-th">Pemenang Tender</th>
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
          <tr class="grand-total-row">
            <td colspan="${7 + vendorCount}" class="grand-total-label-empty"></td>
            <td class="grand-total-label">TOTAL</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      ${nonRespondersSection}
    </div>

    ${footer}
  </div>`;
}

function loadImageAsBase64(src: string): Promise<string> {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			canvas.getContext('2d')?.drawImage(img, 0, 0);
			resolve(canvas.toDataURL('image/png'));
		};
		img.onerror = () => resolve('');
		img.src = src;
	});
}

export async function printComparisonReport(
	data: QuotationComparisonData,
	printedBy: string
): Promise<void> {
	const allQuotations = data.quotations || [];
	const printDate = new Date().toLocaleDateString('id-ID', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});

	const logoBase64 = await loadImageAsBase64('/images/Logo_Socfin.png');

	const vendorChunks: ComparisonQuotation[][] = [];
	for (let i = 0; i < allQuotations.length; i += VENDORS_PER_PAGE) {
		vendorChunks.push(allQuotations.slice(i, i + VENDORS_PER_PAGE));
	}
	if (vendorChunks.length === 0) vendorChunks.push([]);

	const pagesHtml = vendorChunks
		.map((chunk, pageIdx) =>
			buildPageHtml(
				data,
				allQuotations,
				chunk,
				pageIdx * VENDORS_PER_PAGE,
				pageIdx === vendorChunks.length - 1,
				printDate,
				printedBy,
				logoBase64
			)
		)
		.join('');

	const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Perbandingan Harga - ${data.rfq_number}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #000; background: #fff; }

  .page-wrap {
    min-height: 100vh;
    padding: 10mm 10mm 8mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
  }
  .page-wrap:last-child { page-break-after: avoid; }
  .table-wrap { flex: 1; }

  /* Header */
  .report-header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
  .company-block { min-width: 110px; }
  .company-logo { height: 48px; width: auto; display: block; }
  .company-name { font-weight: bold; font-size: 15px; }
  .company-sub { font-size: 14px; }
  .title-block { flex: 1; text-align: center; }
  .title-text { font-weight: bold; font-size: 16px; letter-spacing: 0.3px; }
  .title-date { font-size: 14px; }

  /* Main table */
  .main-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; table-layout: fixed; }
  .main-table th, .main-table td {
    border: 1px solid #888;
    padding: 3px 4px;
    vertical-align: top;
    font-size: 12px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  .main-table thead th {
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
  }
  .tc { text-align: center; }

  .vendor-th { text-align: center; vertical-align: middle; }
  .vendor-name-h { font-weight: bold; font-size: 12px; word-break: break-word; }
  .no-resp { font-size: 11.5px; color: #888; font-style: italic; }

  .last-price-cell { font-size: 12px; color: #444; }

  .vendor-td { vertical-align: top; font-size: 12px; }
  .tidak-merespons { color: #999; font-style: italic; font-size: 12px; }
  .vendor-rfq-num { font-size: 11.5px; color: #555; margin-bottom: 2px; }
  .price-satuan { font-weight: bold; font-size: 12px; }
  .price-total { font-size: 12px; }
  .field { font-size: 11.5px; color: #333; line-height: 1.5; }

  .equiv-block { margin-top: 4px; border-top: none; }
  .equiv-title { font-weight: bold; font-size: 12px; color: #0f4c2a; margin-bottom: 1px; }
  .equiv-code { font-weight: bold; }

  .total-th { text-align: center; vertical-align: middle; font-size: 11.5px; }
  .pemenang-th { text-align: center; vertical-align: middle; font-size: 11.5px; }
  .total-td { vertical-align: top; }
  .total-lowest { font-weight: bold; font-size: 12px; }
  .total-unit { font-size: 11.5px; color: #444; }
  .total-vendor { font-size: 11.5px; color: #0f4c2a; font-style: italic; margin-top: 1px; }
  .pemenang-td { font-size: 12px; vertical-align: top; }

  .grand-total-row td { font-weight: bold; }
  .grand-total-label { text-align: center; }
  .grand-total-label-empty { border: 1px solid #888; }

  .spec-text { font-size: 11.5px; color: #555; font-style: italic; }

  /* Non-responders section */
  .non-responders-section { margin-top: 8px; margin-bottom: 6px; font-size: 13px; }
  .ppn-note { font-style: italic; margin-bottom: 5px; }
  .nr-label { font-weight: bold; margin-bottom: 3px; }
  .nr-table { border-collapse: collapse; }
  .nr-table td { padding: 2px 8px 2px 0; font-size: 12px; vertical-align: top; }
  .nr-no { min-width: 20px; }
  .nr-code { min-width: 90px; }
  .nr-name { }

  /* Footer */
  .footer-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 10px;
    padding-bottom: 6mm;
    font-size: 13px;
    margin-top: auto;
  }
  .footer-note { font-style: italic; margin-bottom: 5px; }
  .footer-meta div { line-height: 1.8; }
  .printed-by { margin-top: 4px; color: #555; }
  .footer-right { text-align: center; min-width: 200px; margin-right: 40mm; margin-bottom: 4mm; }
  .sig-label { font-weight: bold; margin-bottom: 4px; font-size: 13px; }
  .sig-space { height: 90px; border-bottom: 1px solid #000; margin-bottom: 4px; }
  .sig-name { font-size: 13px; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A3 landscape; margin: 0; }
    .page-wrap { padding: 8mm 10mm; min-height: 100vh; }
  }
  @page { size: A3 landscape; margin: 0; }
</style>
</head>
<body>
${pagesHtml}
<script>
  window.onload = function() {
    window.print();
    window.onafterprint = function() { window.close(); };
  };
<\/script>
</body>
</html>`;

	const printWindow = window.open('', '_blank', 'width=1400,height=900');
	if (!printWindow) {
		alert('Popup diblokir. Izinkan popup untuk mencetak laporan.');
		return;
	}
	printWindow.document.open();
	printWindow.document.write(html);
	printWindow.document.close();
}
