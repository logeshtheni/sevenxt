# AWB Barcode Added to Invoice

## Changes Made

### 1. **Installed Barcode Library**
```bash
npm install react-barcode
```

### 2. **Updated OrdersView.tsx**

#### Added Import:
```tsx
import Barcode from 'react-barcode';
```

#### Updated Order Data Mapping:
- **Deliveries Mapping** (line 91): Added `awb_number: d.awb_number`
- **Orders Mapping** (line 185): Added `awb_number: order.awb_number`

#### Added AWB Barcode Section to Invoice:
Located between the customer addresses and line items sections (after line 1003):

```tsx
{/* AWB Barcode Section - Only show if AWB number exists */}
{order.awb_number && (
  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
    <div className="flex flex-col items-center">
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">AWB Tracking Number</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Barcode 
          value={order.awb_number} 
          width={2}
          height={60}
          fontSize={14}
          background="#ffffff"
          lineColor="#000000"
          displayValue={true}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">Scan this barcode for shipment tracking</p>
    </div>
  </div>
)}
```

## Features

### ✅ **Conditional Display**
- The barcode section **only appears** when an AWB number exists (`order.awb_number`)
- If no AWB number is generated yet, the invoice displays normally without the barcode

### ✅ **Barcode Configuration**
- **Format**: CODE128 (default, supports alphanumeric)
- **Width**: 2 pixels per bar (optimal for printing)
- **Height**: 60 pixels
- **Font Size**: 14px for the AWB number text below barcode
- **Display Value**: Shows the AWB number text below the barcode for manual reference

### ✅ **Styling**
- Gradient background (blue to indigo) for visual prominence
- White container with shadow for the barcode
- Centered layout for professional appearance
- Print-friendly (barcode will appear on printed invoices)

## How It Works

### **Workflow:**

1. **Order Created** → No AWB number → Invoice shows without barcode
2. **Order Status: "Ready to Pickup"** → AWB generated via Delhivery API
3. **AWB number saved** to `orders.awb_number` or `deliveries.awb_number`
4. **Invoice Opened** → Barcode automatically appears with AWB number
5. **Print/Download** → Barcode included in printed/PDF invoice

### **Data Flow:**

```
Backend (orders/deliveries table)
  ↓
  awb_number field
  ↓
API Response
  ↓
Frontend (OrdersView.tsx)
  ↓
order.awb_number
  ↓
Invoice Modal
  ↓
<Barcode value={order.awb_number} />
```

## Testing

### **To Test:**

1. Open an order that has an AWB number generated
2. Click the "Eye" icon to view the invoice
3. The barcode should appear between customer addresses and line items
4. The barcode displays the AWB number in scannable format
5. Print the invoice (Ctrl+P) - barcode should be included

### **Expected Behavior:**

- **With AWB**: Barcode section visible with scannable barcode
- **Without AWB**: No barcode section (clean invoice layout)
- **Print**: Barcode prints clearly at high quality

## Barcode Specifications

- **Type**: CODE128 (industry standard for shipping labels)
- **Scannable**: Yes, by standard barcode scanners
- **Human Readable**: Yes, AWB number displayed below barcode
- **Print Quality**: High (2px width ensures clarity)

## Future Enhancements (Optional)

If needed, you can:
1. **Add QR Code**: For mobile scanning with tracking URL
2. **Customize Barcode Type**: Change to CODE39, EAN13, etc.
3. **Add Tracking Link**: Clickable link to Delhivery tracking page
4. **Barcode Position**: Move to header or footer if preferred

## Notes

- The barcode library (`react-barcode`) is lightweight and has no dependencies
- Barcodes are generated client-side (no external API calls)
- The barcode is SVG-based, so it scales perfectly for printing
- Compatible with all modern barcode scanners

---

**Status**: ✅ **IMPLEMENTED AND READY TO USE**

The AWB barcode will now automatically appear on invoices once the AWB number is generated!
