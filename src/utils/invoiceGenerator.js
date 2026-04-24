import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order, user) => {
    const doc = new jsPDF();
    let items = [];
    let paymentMethod = "Credit / Debit Card";
    try {
        const parsed = JSON.parse(order.item || "[]");
        if (Array.isArray(parsed)) {
            items = parsed;
        } else {
            items = parsed.products || [];
            paymentMethod = parsed.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card';
        }
    } catch(e) {
        console.error(e);
    }

    // 1. Header & Branding
    doc.setFontSize(22);
    doc.setTextColor(40, 44, 52); // Dark blue-gray
    doc.text("TECHSTORE", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Premium Electronics & Gadgets", 14, 28);
    
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("INVOICE", 150, 22);

    // 2. Order Info
    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35); // Horizontal line

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 14, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`${user.name}`, 14, 50);
    doc.text(`${user.email}`, 14, 55);

    doc.setFont("helvetica", "bold");
    doc.text("Order Details:", 130, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: #${order.$id}`, 130, 50);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 130, 55);
    doc.text(`Status: ${order.status.toUpperCase()}`, 130, 60);
    doc.text(`Payment: ${paymentMethod}`, 130, 65);

    // 3. The Items Table
    const tableColumn = ["Description", "Quantity", "Price", "Total"];
    const tableRows = [];

    items.forEach(item => {
        const itemData = [
            item.title,
            item.quantity,
            `₹${item.price}`,
            `₹${(item.price * item.quantity).toFixed(2)}`
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 }, // Blue header
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: 14, right: 14 }
    });

    // 4. Totals Section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: ₹${order.total}`, 140, finalY);

    // 5. Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Thank you for shopping with TechStore!", 14, finalY + 20);
    doc.text("If you have any questions, contact support@techstore.com", 14, finalY + 25);

    // 6. Save PDF
    doc.save(`Invoice_TechStore_${order.$id.slice(-6)}.pdf`);
};
