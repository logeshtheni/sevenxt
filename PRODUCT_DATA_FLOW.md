# Product Data Flow: From Frontend to Database

This document explains exactly how product data travels from the user interface to the database storage, including how offer prices are calculated and stored.

## 1. Frontend Layer (React)

**File:** `Frontend/components/ProductsView.tsx`

1.  **User Input**: The user fills out the product form (Name, B2C Price, B2C Discount, Start/End Dates, etc.).
2.  **State Management**: React stores this data in the `formData` state.
3.  **Submission**: When the user clicks "Save Product":
    *   The `handleSaveProduct` function is triggered.
    *   It calls `createProduct` (for new) or `updateProduct` (for existing) from the API service.

**File:** `Frontend/services/api.ts`

*   The API service sends a HTTP request (POST or PUT) to the backend.
*   **Data Format**: JSON.
*   **Field Mapping**: Frontend uses camelCase (e.g., `b2cPrice`), which matches the Pydantic schema aliases in the backend.

## 2. API Layer (FastAPI)

**File:** `backend/app/modules/products/routes.py`

1.  **Endpoint Hit**: The request hits `/api/v1/products/` (POST) or `/api/v1/products/{id}` (PUT).
2.  **Validation**: FastAPI uses Pydantic schemas (`schemas.py`) to validate the incoming data.
    *   **Schema**: `ProductCreate` or `ProductUpdate`.
    *   **Aliases**: Converts JSON `b2cPrice` -> Python `b2c_price`.
    *   **Date Handling**: Converts date strings to Python `datetime` objects.

## 3. Service Layer (Business Logic)

**File:** `backend/app/modules/products/service.py`

This is where the magic happens. Before saving to the database, the service layer processes the data.

1.  **Receive Data**: `create_product` or `update_product` receives the validated data.
2.  **Offer Calculation Logic** (`calculate_offer_prices` function):
    *   **Input**: Base Price, Discount %, Start Date, End Date.
    *   **Check**: Is the offer **ACTIVE** right now?
        *   Condition: `Discount > 0` AND `Start Date <= Current Time <= End Date`.
    *   **If Active**:
        *   Calculates `Offer Price = Base Price * (1 - Discount / 100)`.
        *   Sets `Offer Price` field.
    *   **If NOT Active** (Future date or Expired):
        *   **CLEARS** the offer data immediately.
        *   Sets `Discount = 0`, `Offer Price = 0`, `Dates = None`.
        *   *Result: Scheduled offers are not stored; they are rejected until they are actually active.*

## 4. Database Layer (SQLAlchemy & MySQL)

**File:** `backend/app/modules/products/models.py`

The processed data is mapped to the `Product` database model and saved.

**Table Structure (`products`):**

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(50) | Unique Product ID (e.g., "prod_123") |
| `name` | VARCHAR(255) | Product Name |
| `b2c_price` | FLOAT | Base Selling Price |
| `b2c_discount` | FLOAT | Discount Percentage (e.g., 10.0) |
| `b2c_offer_price` | FLOAT | **Calculated Active Price** (e.g., 900.0) |
| `b2c_offer_start_date`| DATETIME | Start of active offer |
| `b2c_offer_end_date` | DATETIME | End of active offer |
| `status` | VARCHAR(50) | "Active", "Draft", etc. |

*Note: Same structure applies to B2B fields (`b2b_price`, `b2b_offer_price`, etc.)*

## 5. Automatic Cleanup (Background Task)

**File:** `backend/app/modules/products/background_tasks.py`

*   **Frequency**: Runs every 60 seconds.
*   **Action**: Checks database for products where `offer_end_date < current_time`.
*   **Result**: If an offer has expired, it resets `offer_price`, `discount`, and `dates` to NULL/0 in the database.

---

## Summary of Data Lifecycle

1.  **User** enters "10% Discount" starting "Now".
2.  **Frontend** sends JSON: `{ "b2cDiscount": 10, "b2cOfferStartDate": "..." }`.
3.  **Backend Service** sees dates are active → Calculates `Offer Price`.
4.  **Database** stores: `Discount: 10`, `Offer Price: 900`.
5.  **Frontend** reads back: `Offer Price: 900` → Displays "Active 10% Off".

*If User enters "10% Discount" starting "Tomorrow":*
1.  **Backend Service** sees dates are future → **Clears data**.
2.  **Database** stores: `Discount: 0`, `Offer Price: 0`.
3.  **Frontend** reads back: `Offer Price: 0` → Displays "No active offer".
