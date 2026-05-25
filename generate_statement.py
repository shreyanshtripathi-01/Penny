from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import random

def create_bank_statement(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "HDFC BANK LTD.")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 70, "Branch: KORAMANGALA, BENGALURU")
    c.drawString(50, height - 85, "Account Name: SHREYANSH TRIPATHI")
    c.drawString(50, height - 100, "Account Number: 501002XXXXXX")
    c.drawString(50, height - 115, "Statement Period: 01-May-2026 to 31-May-2026")
    
    # Table Header
    y_pos = height - 150
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y_pos, "Date")
    c.drawString(120, y_pos, "Narration / Description")
    c.drawString(380, y_pos, "Withdrawal (Dr)")
    c.drawString(480, y_pos, "Deposit (Cr)")
    
    c.setLineWidth(1)
    c.line(50, y_pos - 5, 550, y_pos - 5)
    
    # Transactions
    transactions = [
        ("01/05/2026", "NEFT-TECH CORP INDIA-SALARY", "", "85000.00"),
        ("02/05/2026", "UPI/ZOMATO/FOOD", "450.00", ""),
        ("04/05/2026", "UPI/UBER/TRANSPORT", "320.00", ""),
        ("05/05/2026", "ACH/APOLLO MUNICH/INSURANCE", "1200.00", ""),
        ("08/05/2026", "POS/RELIANCE SMART/GROCERY", "4500.00", ""),
        ("10/05/2026", "UPI/AMAZON INDIA/SHOPPING", "2100.00", ""),
        ("12/05/2026", "UPI/SWIGGY/FOOD", "350.00", ""),
        ("15/05/2026", "NEFT-FREELANCE CLIENT XYZ", "", "15000.00"),
        ("16/05/2026", "UPI/NETFLIX/SUBSCRIPTION", "649.00", ""),
        ("18/05/2026", "POS/PVR CINEMAS/ENTERTAINMENT", "1200.00", ""),
        ("22/05/2026", "UPI/AIRTEL/BROADBAND", "1050.00", ""),
        ("25/05/2026", "IMPS/RENT TRANSFER/LANDLORD", "25000.00", ""),
        ("28/05/2026", "UPI/BLINKIT/GROCERY", "890.00", ""),
    ]
    
    c.setFont("Helvetica", 9)
    y_pos -= 20
    
    for date, desc, dr, cr in transactions:
        c.drawString(50, y_pos, date)
        c.drawString(120, y_pos, desc)
        if dr:
            c.drawString(380, y_pos, dr)
        if cr:
            c.drawString(480, y_pos, cr)
        y_pos -= 20
        
    c.line(50, y_pos, 550, y_pos)
    c.drawString(50, y_pos - 15, "*** END OF STATEMENT ***")
    
    c.save()

if __name__ == "__main__":
    create_bank_statement("sample_bank_statement.pdf")
