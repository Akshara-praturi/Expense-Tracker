import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { Expense } from '../types/expense';

export function generateExpensesPDF(expenses: Expense[]) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Expense Report', 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 30);
  
  // Add table headers
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  let y = 40;
  
  doc.setFontSize(12);
  doc.text(headers[0], 20, y);
  doc.text(headers[1], 60, y);
  doc.text(headers[2], 120, y);
  doc.text(headers[3], 170, y);
  
  // Add line under headers
  y += 2;
  doc.line(20, y, 190, y);
  
  // Add expense data
  y += 10;
  doc.setFontSize(10);
  
  expenses.forEach((expense) => {
    if (y > 280) { // Check if we need a new page
      doc.addPage();
      y = 20;
    }
    
    doc.text(format(new Date(expense.date), 'PP'), 20, y);
    doc.text(expense.description.substring(0, 30), 60, y);
    doc.text(expense.category, 120, y);
    doc.text(`₹${expense.amount.toFixed(2)}`, 170, y);
    
    y += 10;
  });
  
  // Save the PDF
  doc.save('expense-report.pdf');
}